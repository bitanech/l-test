import { Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CardState } from '../../../enums/card-state.enum';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  animations: [
    trigger('hiddenActive', [
      state('hidden', style({
        boxShadow: '0 0 15px -3px rgba(8,31,11,1)'
      })),
      state('active', style({
        boxShadow: '0 0 15px -3px rgba(181,45,181,1)'
      })),
      state('opened', style({
        boxShadow: '0 0 15px -3px rgba(33,158,48,1)'
      })),
      transition('* <=> *', [
        animate('0.3s')
      ]),
    ])
  ]
})
export class GameCardComponent {
  @Input() value: number;
  @Input() state: CardState;

  readonly CARD_STATES: typeof CardState = CardState;

  constructor() {
  }
}
