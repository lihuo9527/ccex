import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonLayoutComponent } from '../common-layout/components/common-layout/common-layout.component';
import { LottosComponent } from './components/lottos/lottos.component';
import { MyParticipationComponent } from './components/my-participation/my-participation.component';
import { EventsComponent } from './components/events/events.component';
import { LottoDetailComponent } from './components/lotto-detail/lotto-detail.component';
import { EventsDetailComponent } from './components/events-detail/events-detail.component';
import { AirDropCommissionsComponent } from './components/air-drop-commissions/air-drop-commissions.component';
import { DailyRankingComponent } from './components/daily-ranking/daily-ranking.component';
const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [{ path: '', component: EventsComponent }]
  },
  {
    path: 'lottos',
    component: CommonLayoutComponent,
    children: [{ path: '', component: LottosComponent }],
    
  },
  {
    path: 'my_participation',
    component: CommonLayoutComponent,
    children: [{ path: '', component: MyParticipationComponent }],
  }
  ,
  {
    path: 'lotto_detail',
    component: CommonLayoutComponent,
    children: [{ path: '', component: LottoDetailComponent }],
  },
  {
    path: 'events_detail',
    component: CommonLayoutComponent,
    children: [{ path: '', component: EventsDetailComponent }],
  }
  ,
  {
    path: 'air_drop_commissions',
    component: CommonLayoutComponent,
    children: [{ path: '', component: AirDropCommissionsComponent }],
  }
  ,
  {
    path: 'daily_ranking',
    component: CommonLayoutComponent,
    children: [{ path: '', component: DailyRankingComponent }],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
