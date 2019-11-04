import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MahjongGameRoutingModule } from './mahjong-game-routing.module';
import { MahjongGameComponent } from './mahjong-game.component';
import { GameCardComponent } from './game-card/game-card.component';
import { MahjongService } from '../../services/mahjong.service';
import { config, GAME_CONFIGURATION } from './mahjong-game.config';
import { GameCardStatePipe } from './game-card/game-card-state.pipe';

@NgModule({
  declarations: [
    MahjongGameComponent,
    GameCardComponent,
    GameCardStatePipe
  ],
  imports: [
    CommonModule,
    MahjongGameRoutingModule
  ],
  providers: [
    MahjongService,
    {
      provide: GAME_CONFIGURATION,
      useValue: config
    }
  ]
})
export class MahjongGameModule { }
