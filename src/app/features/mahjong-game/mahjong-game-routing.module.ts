import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MahjongGameComponent } from './mahjong-game.component';

const routes: Routes = [
  {
    path: '',
    component: MahjongGameComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MahjongGameRoutingModule {
}
