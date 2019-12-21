import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SoftwareRouterActivate } from './software.router.activate';

import { LayoutComponent } from './layout/layout.component'; 
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { LeadComponent } from './lead/lead.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesDetailComponent } from './sales-detail/sales-detail.component';
import { SupportListComponent } from './support-list/support-list.component';
import { SupportDetailComponent } from './support-detail/support-detail.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [SoftwareRouterActivate],
    children: [
      { path: '', component: DashboardComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'sys/dashboard', component: DashboardComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/lead', component: LeadComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/lead/detail/:id', component: LeadDetailComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/sales', component: SalesListComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/sales/detail/:id', component: SalesDetailComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/support', component: SupportListComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/support/detail/:id', component: SupportDetailComponent, canActivate: [SoftwareRouterActivate] },
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