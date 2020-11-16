import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgZorroAntdModule
  ],
  declarations: [],
  exports:[
    CommonModule,
    TranslateModule,
    FormsModule,
    NgZorroAntdModule
  ]
})
export class ShareModule { }