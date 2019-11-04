import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, delay, filter } from 'rxjs/operators';

import { Card } from '../../interfaces/card';
import { MahjongService } from '../../services/mahjong.service';
import { CardState } from '../../enums/card-state.enum';
import { GAME_CONFIGURATION } from './mahjong-game.config';

@Component({
  selector: 'app-mahjong-game',
  templateUrl: './mahjong-game.component.html',
  styleUrls: ['./mahjong-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MahjongGameComponent implements OnInit, OnDestroy {
  readonly cardsList$: BehaviorSubject<Card[]> = new BehaviorSubject([]);

  private readonly cardClickedIndex$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  private readonly pairIndex: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  readonly subscriptions: Subscription = new Subscription();

  private gameStarted = false;

  constructor(private readonly mahjongService: MahjongService,
              @Inject(GAME_CONFIGURATION) private readonly config) {
    this.cardsList$.next(this.mahjongService.initializeGame());
  }

  ngOnInit(): void {
    const { pairsLength } = this.config;

    this.initGame(3000);

    const sub1: Subscription = this.cardClickedIndex$
      .pipe(
        filter((v: number) => !!this.gameStarted &&
          this.cardsList$.getValue()[v].state === CardState.Closed)
      )
      .subscribe((v) => {
        this.pairIndex.next([...this.pairIndex.getValue(), v]);

        const pairIndex: number[] = this.pairIndex.getValue();

        if (pairIndex.length <= pairsLength) {
          this.activateCards(pairIndex);
        } else {
          this.checkSelectedCards(pairIndex) ? this.openCards(pairIndex) : this.closeCards(pairIndex);
        }
      });

    const sub2: Subscription = this.cardsList$
      .pipe(
        debounceTime(800),
        filter(() => this.pairIndex.getValue().length === pairsLength),
        delay(2000),
        filter(() => this.pairIndex.getValue().length === pairsLength),
      )
      .subscribe(() => {
        const pairIndex = this.pairIndex.getValue();

        this.checkSelectedCards(pairIndex) ?
            this.openCards(pairIndex) :
            this.closeCards(pairIndex);
        }
      );

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  onCardClick(i: number) {
    this.cardClickedIndex$.next(i);
  }

  private hideCards(cards: Card[]) {
    const hiddenCards: Card[] = cards.map((c: Card) => ({...c, state: CardState.Closed}));

    this.cardsList$.next(hiddenCards);
  }

  private activateCards(indexArr: number[]) {
    const list: Card[] = this.cardsList$.getValue();

    indexArr.forEach(v => {
      if (list[v].state !== CardState.Selected) {
        list[v] = { ...list[v], state: CardState.Selected };
      }
    });

    this.cardsList$.next(list);
  }

  private openCards(indexArr: number[]) {
    const list: Card[] = this.cardsList$.getValue();

    indexArr
      .slice(0, 2)
      .forEach(v => list[v] = { ...list[v], state: CardState.Opened });

    indexArr.splice(0, 2);

    indexArr
      .forEach(v => list[v] = { ...list[v], state: CardState.Selected });

    this.cardsList$.next(list);

    this.pairIndex.next(indexArr);
  }

  private closeCards(indexArr: number[]) {
    const list: Card[] = this.cardsList$.getValue();

    indexArr
      .forEach(v => list[v] = { ...list[v], state: CardState.Closed });

    this.cardsList$.next(list);
    this.pairIndex.next([]);
  }

  private checkSelectedCards(indexArr: number[]) {
    const list: Card[] = this.cardsList$.getValue();

    const filteredSelected: Card[] = list.filter((c, i) => indexArr.slice(0, 2).includes(i));

    return !!filteredSelected.length &&
      filteredSelected[0].value === filteredSelected[1].value;
  }

  private initGame(hideDelay: number): void {
    const interval = setInterval(() => {
      this.hideCards(this.cardsList$.getValue());
      this.gameStarted = true;
      clearInterval(interval);
    }, hideDelay);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
