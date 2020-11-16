import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/modules/share/share.module';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { InviteComponent } from './components/invite.component';
import { InviteRoutingModule } from './invite-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import { PipesModule } from 'src/app/modules/share/pipes/pipe.module';
@NgModule({
  imports: [
    ShareModule,
    CommonLayoutModule,
    InviteRoutingModule,
    QRCodeModule,
    PipesModule,
  ],
  declarations: [InviteComponent]
})
export class InviteModule { }
