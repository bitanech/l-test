import { CardState } from '../enums/card-state.enum';

export interface Card {
  value: number;
  state: CardState;
}
