import { NgModule } from '@angular/core';
import { TransferComponent } from './transfer.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ShareModule } from 'src/app/modules/share/share.module';
import { PipesModule } from 'src/app/modules/share/pipes/pipe.module';
@NgModule({
  imports: [
    ShareModule,
    NgxEchartsModule,
    PipesModule,
  ],
  declarations: [TransferComponent],
  exports: [TransferComponent]
})
export class TransferModule { }
