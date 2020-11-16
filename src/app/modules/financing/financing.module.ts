import { NgModule } from '@angular/core';
import { ProductsOnSaleComponent } from './components/products-on-sale/products-on-sale.component';
import { MySubscriptionComponent } from './components/my-subscription/my-subscription.component';
import { MyBonusComponent } from './components/my-bonus/my-bonus.component';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { FinancingRoutingModule } from './financing-routing.module';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ShareModule } from 'src/app/modules/share/share.module';
import { QRCodeModule } from 'angularx-qrcode';
import { TransferModule } from './components/transfer/transfer.module';
import { PipesModule } from 'src/app/modules/share/pipes/pipe.module';
@NgModule({
  imports: [
    ShareModule,
    CommonLayoutModule,
    NgxEchartsModule,
    FinancingRoutingModule,
    QRCodeModule,
    TransferModule,
    PipesModule
  ],
  declarations: [
    ProductsOnSaleComponent,
    MySubscriptionComponent,
    MyBonusComponent,
    ProductDetailsComponent
  ]
})
export class FinancingModule { }
