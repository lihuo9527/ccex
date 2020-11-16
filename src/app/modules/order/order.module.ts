import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OpenOrdersComponent } from './components/open-orders/open-orders.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { DealtOrdersComponent } from './components/dealt-orders/dealt-orders.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    OrderRoutingModule,
    CommonLayoutModule,
    TranslateModule
  ],
  declarations: [OpenOrdersComponent, DealtOrdersComponent]
})
export class OrderModule { }
