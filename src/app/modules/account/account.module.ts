import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/modules/share/share.module';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { LoginByPhoneComponent } from './components/login-by-phone/login-by-phone.component';
import { SignupByPhoneComponent } from './components/signup-by-phone/signup-by-phone.component';
import { PasswordForgetByEmailComponent } from './components/password-forget/password-forget-by-email/password-forget-by-email.component';
import { PasswordForgetByPhoneComponent } from './components/password-forget/password-forget-by-phone/password-forget-by-phone.component';
import { ResetPasswordModule } from 'src/app/modules/share/reset-password/reset-password.module';
import { GoogleValidateModule } from 'src/app/modules/share/google-validate/google-validate.module';
@NgModule({
  imports: [
    ShareModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    CommonLayoutModule,
    GoogleValidateModule,
    ResetPasswordModule
  ],
  declarations: [
    LoginComponent,
    LoginByPhoneComponent,
    SignupComponent,
    SignupByPhoneComponent,
    PasswordForgetByEmailComponent,
    PasswordForgetByPhoneComponent,
  ]
})
export class AccountModule { }
