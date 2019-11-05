import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

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
  private readonly cardClickedIndex$: BehaviorSubject<number> = new BehaviorSubject(undefined);
  private readonly subscriptions: Subscription = new Subscription();

  cardsList$: Observable<Card[]>;

  constructor(private readonly mahjongService: MahjongService,
              @Inject(GAME_CONFIGURATION) private readonly config) {
    this.cardsList$ = this.mahjongService.cardListChanges$;
  }

  ngOnInit(): void {
    const { pairsLength } = this.config;

    this.mahjongService.initGame(3000);

    const sub1: Subscription = this.cardClickedIndex$
      .pipe(
        filter((v: number) => !!this.mahjongService.gameStarted &&
          this.mahjongService.cardsStorage[v].state === CardState.Closed)
      )
      .subscribe((v) => {
        this.mahjongService.setPairIndex = [...this.mahjongService.pairIndex, v];

        const pairIndex: number[] = this.mahjongService.pairIndex;

        if (pairIndex.length <= pairsLength) {
          this.mahjongService.activateCards(pairIndex);
        } else {
          this.mahjongService.checkSelectedCards(pairIndex) ?
            this.mahjongService.openCards(pairIndex) :
            this.mahjongService.closeCards(pairIndex);
        }
      });

    const sub2: Subscription = this.cardsList$
      .pipe(
        debounceTime(2000),
        filter(() => this.mahjongService.pairIndex.length === pairsLength),
      )
      .subscribe(() => {
        const pairIndex = this.mahjongService.pairIndex;

        this.mahjongService.checkSelectedCards(pairIndex) ?
            this.mahjongService.openCards(pairIndex) :
            this.mahjongService.closeCards(pairIndex);
        }
      );

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  onCardClick(i: number): void {
    this.cardClickedIndex$.next(i);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
