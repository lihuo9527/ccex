import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonLayoutComponent } from '../common-layout/components/common-layout/common-layout.component';
import { OpenOrdersComponent } from './components/open-orders/open-orders.component';
import { DealtOrdersComponent } from './components/dealt-orders/dealt-orders.component';

const routes: Routes = [
  {
    path: 'open',
    component: CommonLayoutComponent,
    children: [ { path: '', component: OpenOrdersComponent } ]
  },
  {
    path: 'dealt',
    component: CommonLayoutComponent,
    children: [ { path: '', component: DealtOrdersComponent } ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
