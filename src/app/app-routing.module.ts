import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: './modules/top/top.module#TopModule'
  },
  {
    path: 'account',
    loadChildren: './modules/account/account.module#AccountModule'
  },
  {
    path: 'settings',
    canActivate: [AuthGuardService],
    loadChildren: './modules/settings/settings.module#SettingsModule'
  },
  {
    path: 'order',
    canActivate: [AuthGuardService],
    loadChildren: './modules/order/order.module#OrderModule'
  },
  {
    path: 'wallet',
    loadChildren: './modules/wallet/wallet.module#WalletModule'
  },
  {
    path: 'trade',
    loadChildren: './modules/trade/trade.module#TradeModule'
  },
  {
    path: 'invite',
    canActivate: [AuthGuardService],
    loadChildren: './modules/invite/invite.module#InviteModule'
  },
  {
    path: 'financing',
    loadChildren: './modules/financing/financing.module#FinancingModule'
  },
  {
    path: 'events',
    loadChildren: './modules/events/events.module#EventsModule',
    // canActivate: [AuthGuardService]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
