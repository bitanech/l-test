import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Card } from '../interfaces/card';
import { GAME_CONFIGURATION } from '../features/mahjong-game/mahjong-game.config';
import { CardState } from '../enums/card-state.enum';

@Injectable()
export class MahjongService {
  private readonly cardsList$: BehaviorSubject<Card[]> = new BehaviorSubject([]);
  private readonly pairIndex$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  gameStarted = false;

  get cardListChanges$() {
    return this.cardsList$.asObservable();
  }

  get cardsStorage() {
    return this.cardsList$.getValue();
  }

  get pairIndex(): number[] {
    return this.pairIndex$.getValue();
  }

  set setPairIndex(v: number[]) {
    this.pairIndex$.next(v);
  }

  private set setCards(cards: Card[]) {
    this.cardsList$.next(cards);
  }

  constructor(@Inject(GAME_CONFIGURATION) private config) {}

  initGame(hideDelay: number): void {
    this.setCards = this.generateCards();

    const interval = setInterval(() => {
      this.hideCards(this.cardsStorage);
      this.gameStarted = true;
      clearInterval(interval);
    }, hideDelay);
  }

  activateCards(indexArr: number[]) {
    const list: Card[] = this.cardsStorage;

    indexArr.forEach(v => {
      if (list[v].state !== CardState.Selected) {
        list[v].state = CardState.Selected;
      }
    });

    this.setCards = list;
  }

  openCards(indexArr: number[]): void {
    const list: Card[] = this.cardsStorage;

    indexArr
      .slice(0, 2)
      .forEach(v => {
        list[v].state = CardState.Opened;
      });

    indexArr.splice(0, 2);

    indexArr
      .forEach(v => {
        list[v].state = CardState.Selected;
      });

    this.setCards = list;

    this.setPairIndex = indexArr;
  }

  closeCards(indexArr: number[]) {
    const list: Card[] = this.cardsStorage;

    indexArr
      .forEach(v => {
        list[v].state = CardState.Closed;
      });

    this.setCards = list;

    this.setPairIndex = [];
  }

  checkSelectedCards(indexArr: number[]) {
    const list: Card[] = this.cardsStorage;

    const filteredSelected: Card[] = list.filter((c, i) => indexArr.slice(0, 2).includes(i));

    return !!filteredSelected.length &&
      filteredSelected[0].value === filteredSelected[1].value;
  }

  private hideCards(cards: Card[]) {
    cards.forEach((c: Card, i: number) => {
      cards[i].state = CardState.Closed;
    });

    this.setCards = cards;
  }

  private generateCards(): Card[] {
    const { minValue, maxValue } = this.config;

    const gameValue: number[] = this.getArrayPrimeNumbers(minValue, maxValue);

    return this.shuffle(gameValue.concat(gameValue))
      .map((v: number) => ({ value: v, state: CardState.Selected }));
  }

  private getArrayPrimeNumbers(min: number, max: number): number[] {
    return Array(max)
      .fill(0, min - 1, max)
      .map((v, i) => i + 1)
      .filter(v => this.isPrime(v));
  }

  private isPrime(n: number): boolean {
    const arr: number[] = [];

    for (let i = 2; i < n; i++ ) {
      if (n % i === 0) {
        arr.push(i);
      }
    }

    return !arr.length && n > 1;
  }

  private shuffle(array: number[]): number[] {
    return array
      .sort(() => .5 - Math.random());
  }

}
