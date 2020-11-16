import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonLayoutComponent } from '../common-layout/components/common-layout/common-layout.component';
import { InviteComponent } from './components/invite.component';

const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [ { path: '', component: InviteComponent } ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteRoutingModule { }
