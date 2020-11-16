import { NgModule } from '@angular/core';
import { ShareModule } from '../share.module';
import { ResetPasswordComponent } from './reset-password.component'
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    ShareModule,
    ReactiveFormsModule
  ],
  declarations: [
    ResetPasswordComponent
  ],
  exports:[
    ResetPasswordComponent
  ]
})
export class ResetPasswordModule { }
