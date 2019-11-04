import { Inject, Injectable } from '@angular/core';

import { Card } from '../interfaces/card';
import { GAME_CONFIGURATION } from '../features/mahjong-game/mahjong-game.config';
import { CardState } from '../enums/card-state.enum';

@Injectable()
export class MahjongService {
  constructor(@Inject(GAME_CONFIGURATION) private config) {}

  initializeGame(): Card[] {
    return this.generateCards();
  }

  private generatePairs(): number[] {
    const { cardsListLength, pairsLength } = this.config;

    const pairs: number[] = Array(cardsListLength / pairsLength)
      .fill(0);

    pairs.forEach((p, i) => {
      let generatedValue = this.generateRandomValue();

      while (pairs.includes(generatedValue)) {
        generatedValue = this.generateRandomValue();
      }

      pairs[i] = generatedValue;
    });

    return pairs;
  }

  private generateCards(): Card[] {
    const { cardsListLength } = this.config;

    const pairValues = this.generatePairs();

    const initialCard: Card = { value: 0, state: CardState.Selected };

    const cards: Card[] = Array(cardsListLength).fill(initialCard);

    cards.forEach((c, i) => {
      const generateCardValue = this.generateCardValue(cards, pairValues, this.generateRandomValue());

      cards[i] = { ...c, value: generateCardValue };

      this.reducePairs(cards, pairValues, generateCardValue);
    });

    return cards;
  }

  private generateRandomValue(): number {
    const { maxValue } = this.config;

    return Math.floor(Math.random() * maxValue) + 1;
  }

  private getPairsLength(cards: Card[], value: number): number {
    return cards
      .filter((c: Card) => c.value === value).length;
  }

  private reducePairs(cards: Card[], pairs: number[], value: number) {
    const { pairsLength } = this.config;

    if (this.getPairsLength(cards, value) === pairsLength) {
      const findValue = pairs.findIndex(v => v === value);
      pairs.splice(findValue, 1);
    }
  }

  private generateCardValue(cards: Card[], pairs: number[], value: number) {
    const { pairsLength } = this.config;

    const getPairs = this.getPairsLength(cards, value);

    return getPairs < pairsLength && pairs.includes(value) ? value : this.generateCardValue(cards, pairs, this.generateRandomValue());
  }
}
