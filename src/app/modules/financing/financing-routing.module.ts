import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonLayoutComponent } from '../common-layout/components/common-layout/common-layout.component';
import { ProductsOnSaleComponent } from './components/products-on-sale/products-on-sale.component'
import { MyBonusComponent } from './components/my-bonus/my-bonus.component';
import { MySubscriptionComponent } from './components/my-subscription/my-subscription.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
const routes: Routes = [
  {
    path: 'products_on_sale',
    component: CommonLayoutComponent,
    children: [{ path: '', component: ProductsOnSaleComponent }]
  },
  {
    path: 'my_subscription',
    component: CommonLayoutComponent,
    children: [{ path: '', component: MySubscriptionComponent }],
    canActivate: [AuthGuardService]
  },
  {
    path: 'my_bonus',
    component: CommonLayoutComponent,
    children: [{ path: '', component: MyBonusComponent }],
    canActivate: [AuthGuardService]
  },
  {
    path: 'product_details',
    component: CommonLayoutComponent,
    children: [{ path: '', component: ProductDetailsComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancingRoutingModule { }
