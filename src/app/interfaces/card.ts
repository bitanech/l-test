import { CardState } from '../enums/card-state.enum';

export interface Card {
  value: number;
  readonly state: CardState;
}
