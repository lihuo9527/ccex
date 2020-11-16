import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/modules/share/share.module';
import { WalletRoutingModule } from './wallet-routing.module';
import { BalanceComponent } from './components/balance/balance.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { QRCodeModule } from 'angularx-qrcode';
import { GoogleValidateModule } from 'src/app/modules/share/google-validate/google-validate.module';
import { PipesModule } from 'src/app/modules/share/pipes/pipe.module';
@NgModule({
  imports: [
    ShareModule,
    WalletRoutingModule,
    CommonLayoutModule,
    QRCodeModule,
    GoogleValidateModule,
    PipesModule
  ],
  declarations: [BalanceComponent, DepositComponent, WithdrawComponent]
})
export class WalletModule { }
