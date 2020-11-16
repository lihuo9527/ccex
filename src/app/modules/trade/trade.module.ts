import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/modules/share/share.module';
import { TradeRoutingModule } from './trade-routing.module';
import { TradeComponent } from './components/trade/trade.component';
import { TvChartContainerComponent } from './components/tv-chart-container/tv-chart-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/modules/share/pipes/pipe.module';

@NgModule({
  imports: [
    ShareModule,
    ReactiveFormsModule,
    TradeRoutingModule,
    PipesModule,
  ],
  declarations: [TradeComponent, TvChartContainerComponent]
})
export class TradeModule { }
