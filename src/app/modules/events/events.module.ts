import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/modules/share/share.module';
import { CommonLayoutModule } from '../common-layout/common-layout.module';
import { EventsRoutingModule } from './events-routing.module';
import { LottosComponent } from './components/lottos/lottos.component';
import { MyParticipationComponent } from './components/my-participation/my-participation.component';
import { EventsComponent } from './components/events/events.component';
import { LottoDetailComponent } from './components/lotto-detail/lotto-detail.component';
import { EventsDetailComponent } from './components/events-detail/events-detail.component';
import { AirDropCommissionsComponent } from './components/air-drop-commissions/air-drop-commissions.component';
import { PipesModule } from 'src/app/modules/share/pipes/pipe.module';
import { DailyRankingComponent } from './components/daily-ranking/daily-ranking.component';
@NgModule({
  imports: [
    ShareModule,
    CommonLayoutModule,
    EventsRoutingModule,
    PipesModule,
  ],
  declarations: [
    MyParticipationComponent,
    LottosComponent,
    EventsComponent,
    LottoDetailComponent,
    EventsDetailComponent,
    AirDropCommissionsComponent,
    DailyRankingComponent
  ]
})
export class EventsModule { }
