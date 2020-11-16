import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceComponent } from './components/balance/balance.component';
import { WalletTabId } from './models/wallet-tab-id';
import { CommonLayoutComponent } from '../common-layout/components/common-layout/common-layout.component';

const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: '',
        component: BalanceComponent,
        data: { tabId: WalletTabId.Balance }
      }
    ]
  },
  // {
  //   path: 'balance',
  //   component: CommonLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: BalanceComponent,
  //       data: { tabId: WalletTabId.Balance }
  //     }
  //   ]
  // },
  // {
  //   path: 'deposit',
  //   component: CommonLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: BalanceComponent,
  //       data: { tabId: WalletTabId.Deposit }
  //     }
  //   ]
  // },
  // {
  //   path: 'withdraw',
  //   component: CommonLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: BalanceComponent,
  //       data: { tabId: WalletTabId.Withdraw }
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletRoutingModule { }
