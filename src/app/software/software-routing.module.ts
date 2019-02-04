import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SoftwareRouterActivate } from './software.router.activate';

import { LayoutComponent } from './layout/layout.component'; 
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { LeadComponent } from './lead/lead.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [SoftwareRouterActivate],
    children: [
      { path: '', component: DashboardComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'sys/dashboard', component: DashboardComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/lead', component: LeadComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/lead/detail/:id', component: LeadDetailComponent, canActivate: [SoftwareRouterActivate] }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SoftwareRoutingModule { }