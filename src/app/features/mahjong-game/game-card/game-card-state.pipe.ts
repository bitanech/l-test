import { Pipe, PipeTransform } from '@angular/core';

import { CardState } from '../../../enums/card-state.enum';

@Pipe({
  name: 'gameCardState'
})
export class GameCardStatePipe implements PipeTransform {

  transform(value: CardState): any {
    switch (value) {
      case CardState.Selected:
        return 'active';
      case CardState.Opened:
        return 'opened';
      case CardState.Closed:
        return 'hidden';
    }
  }

}
