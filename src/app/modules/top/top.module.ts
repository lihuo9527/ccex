import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopRoutingModule } from './top-routing.module';
import { HomeComponent } from './components/home/home.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TopRoutingModule,
    NgZorroAntdModule,
    CommonLayoutModule,
    TranslateModule
  ],
  declarations: [HomeComponent]
})
export class TopModule { }
