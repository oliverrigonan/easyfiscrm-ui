import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SoftwareRoutingModule } from './software-routing.module';
import { SoftwareRouterActivate } from './software.router.activate';

import { LayoutComponent } from './layout/layout.component';
import { LeadComponent } from './lead/lead.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesDetailComponent } from './sales-detail/sales-detail.component';
import { SupportListComponent } from './support-list/support-list.component';
import { SupportDetailComponent } from './support-detail/support-detail.component';
import { LeadReportComponent } from './report/lead-report/lead-report.component';
import { SalesdeliveryReportComponent } from './report/salesdelivery-report/salesdelivery-report.component';
import { SupportReportComponent } from './report/support-report/support-report.component';
import { ActivityReportComponent } from './report/activity-report/activity-report.component';

@NgModule({
  declarations: [LayoutComponent, DashboardComponent, LeadComponent, LeadDetailComponent, SalesListComponent, SalesDetailComponent, SupportListComponent, SupportDetailComponent, LeadReportComponent, SalesdeliveryReportComponent, SupportReportComponent, ActivityReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SoftwareRoutingModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    WjGridFilterModule,
    WjGridModule,
    WjInputModule,
    ModalModule.forRoot()
  ],
  providers: [
    SoftwareRouterActivate
  ]
})
export class SoftwareModule { }
