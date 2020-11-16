import { NgModule } from '@angular/core';
import { ShareModule } from '../share.module';
import { GoogleValidateComponent } from './google-validate.component';
@NgModule({
  imports: [
    ShareModule
  ],
  declarations: [
    GoogleValidateComponent
  ],
  exports:[
    GoogleValidateComponent
  ]
})
export class GoogleValidateModule { }
