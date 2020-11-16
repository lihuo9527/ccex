import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { SecurityComponent } from './components/security/security.component';
import { ApiKeysComponent } from './components/api-keys/api-keys.component';
import { CommonLayoutComponent } from '../common-layout/components/common-layout/common-layout.component';
import { GoogleAuthenticationComponent } from './components/google-authentication/google-authentication.component';
import { GoogleAuthentictionInvalidationComponent } from './components/google-authentiction-invalidation/google-authentiction-invalidation.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { BindPhoneComponent } from './components/bind-phone/bind-phone.component';

const routes: Routes = [
  {
    path: 'google-authentication',
    component: CommonLayoutComponent,
    children: [ { path: '', component: GoogleAuthenticationComponent } ]
  },
  {
    path: 'google-authentication',
    component: CommonLayoutComponent,
    children: [ { path: 'invalidation', component: GoogleAuthentictionInvalidationComponent }]
  },
  {
    path: 'password-reset',
    component: CommonLayoutComponent,
    children: [ { path: '', component: PasswordResetComponent } ]
  },
  {
    path: 'overview',
    component: CommonLayoutComponent,
    children: [ { path: '', component: OverviewComponent } ]
  },
  {
    path: 'security',
    component: CommonLayoutComponent,
    children: [ { path: '', component: SecurityComponent } ]
  },
  {
    path: 'apikeys',
    component: CommonLayoutComponent,
    children: [ { path: '', component: ApiKeysComponent } ]
  },
  {
    path: 'bind_phone',
    component: CommonLayoutComponent,
    children: [ { path: '', component: BindPhoneComponent } ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
