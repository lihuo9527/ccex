import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { CommonLayoutComponent } from './components/common-layout/common-layout.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgZorroAntdModule,
    TranslateModule
  ],
  declarations: [ CommonLayoutComponent],
  exports: [ CommonLayoutComponent]
})
export class CommonLayoutModule { }
