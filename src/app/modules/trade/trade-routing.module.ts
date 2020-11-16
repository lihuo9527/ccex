import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradeComponent } from './components/trade/trade.component';

const routes: Routes = [
  {
    path: ':pair',
    component: TradeComponent
  },
  {
    path: '',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
