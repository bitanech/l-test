import { InjectionToken } from '@angular/core';

export const config = {
  minValue: 1,
  maxValue: 50,
  cardsListLength: 30,
  pairsLength: 2
};

export const GAME_TOKEN_NAME = 'GAME_CONFIGURATION';

export const GAME_CONFIGURATION = new InjectionToken<string>(GAME_TOKEN_NAME);
