import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SoftwareRouterActivate } from './software.router.activate';

import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadComponent } from './lead/lead.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesDetailComponent } from './sales-detail/sales-detail.component';
import { SupportListComponent } from './support-list/support-list.component';
import { SupportDetailComponent } from './support-detail/support-detail.component';
import { LeadReportComponent } from './report/lead-report/lead-report.component';
import { SalesdeliveryReportComponent } from './report/salesdelivery-report/salesdelivery-report.component';
import { SupportReportComponent } from './report/support-report/support-report.component';
import { ActivityReportComponent } from './report/activity-report/activity-report.component';
import { ActivityComponent } from './activity/activity.component';
import { UserComponent } from './setup/user/user.component';
import { ProductComponent } from './setup/product/product.component';
import { StatusComponent } from './setup/status/status.component';
import { LeadStaffReportComponent } from './report/lead-staff-report/lead-staff-report.component';
import { SalesDeliveryStaffReportComponent } from './report/sales-delivery-staff-report/sales-delivery-staff-report.component';
import { SupportStaffReportComponent } from './report/support-staff-report/support-staff-report.component';
import { ProductDetailComponent } from './setup/product-detail/product-detail.component';
import { SoftwareDevelopmentStaffReportComponent } from './report/software-development-staff-report/software-development-staff-report.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [SoftwareRouterActivate],
    children: [
      { path: '', component: DashboardComponent,canActivate: [SoftwareRouterActivate] },
      { path: 'sys/dashboard', component: DashboardComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/lead', component: LeadComponent, data: { shouldReuse: true},canActivate: [SoftwareRouterActivate] },
      { path: 'trn/lead/:startDate/:endDate/:status/:userId/:dashboard', component: LeadComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/lead/detail/:id', component: LeadDetailComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/sales', component: SalesListComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/sales/:startDate/:endDate/:status/:userId/:dashboard', component: SalesListComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/sales/detail/:id', component: SalesDetailComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/support', component: SupportListComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/support/:startDate/:endDate/:status/:userId/:dashboard', component: SupportListComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/support/detail/:id', component: SupportDetailComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'trn/activity', component: ActivityComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/lead', component: LeadReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/lead/staff', component: LeadStaffReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/sales-delivery/staff', component: SalesDeliveryStaffReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/support/staff', component: SupportStaffReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/software/development/staff', component: SoftwareDevelopmentStaffReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/sales/delivery', component: SalesdeliveryReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/support', component: SupportReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'report/activity', component: ActivityReportComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'setup/user', component: UserComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'setup/product', component: ProductComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'setup/product/detail/:id', component: ProductDetailComponent, canActivate: [SoftwareRouterActivate] },
      { path: 'setup/status', component: StatusComponent, canActivate: [SoftwareRouterActivate] },
      { path: '**', component: DashboardComponent,canActivate: [SoftwareRouterActivate] }
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