import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OverviewComponent } from './components/overview/overview.component';
import { SecurityComponent } from './components/security/security.component';
import { ApiKeysComponent } from './components/api-keys/api-keys.component';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { GoogleAuthenticationComponent } from './components/google-authentication/google-authentication.component';
import { GoogleAuthentictionInvalidationComponent } from './components/google-authentiction-invalidation/google-authentiction-invalidation.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { TranslateModule } from '@ngx-translate/core';
import { BindPhoneComponent } from './components/bind-phone/bind-phone.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ResetPasswordModule } from 'src/app/modules/share/reset-password/reset-password.module';
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    CommonLayoutModule,
    TranslateModule,
    FormsModule,
    QRCodeModule,
    ResetPasswordModule
  ],
  declarations: [
    OverviewComponent,
    SecurityComponent,
    ApiKeysComponent,
    GoogleAuthenticationComponent,
    GoogleAuthentictionInvalidationComponent,
    PasswordResetComponent,
    BindPhoneComponent
  ]
})
export class SettingsModule { }
