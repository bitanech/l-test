import { Component, Input, OnInit } from '@angular/core';

import { Card } from '../../../interfaces/card';
import { CardState } from '../../../enums/card-state.enum';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent implements OnInit {
  @Input() card: Card;

  readonly CARD_STATES: typeof CardState = CardState;

  constructor() { }

  ngOnInit() {
  }

}
