import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommonLayoutComponent } from '../common-layout/components/common-layout/common-layout.component';
import { LoginByPhoneComponent } from './components/login-by-phone/login-by-phone.component';
import { SignupByPhoneComponent } from './components/signup-by-phone/signup-by-phone.component';
import { PasswordForgetByEmailComponent } from './components/password-forget/password-forget-by-email/password-forget-by-email.component';
import { PasswordForgetByPhoneComponent } from './components/password-forget/password-forget-by-phone/password-forget-by-phone.component';
const routes: Routes = [
  {
    path: 'login',
    component: CommonLayoutComponent,
    children: [{ path: '', component: LoginComponent }]
  },
  {
    path: 'login_phone',
    component: CommonLayoutComponent,
    children: [{ path: '', component: LoginByPhoneComponent }]
  },
  {
    path: 'signup',
    component: CommonLayoutComponent,
    children: [{ path: '', component: SignupComponent }]
  },
  {
    path: 'signup_phone',
    component: CommonLayoutComponent,
    children: [{ path: '', component: SignupByPhoneComponent }]
  },
  {
    path: 'password-forget_email',
    component: CommonLayoutComponent,
    children: [{ path: '', component: PasswordForgetByEmailComponent }]
  },
  {
    path: 'password-forget_phone',
    component: CommonLayoutComponent,
    children: [{ path: '', component: PasswordForgetByPhoneComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
