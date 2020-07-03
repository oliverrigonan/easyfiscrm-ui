import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

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
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

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
import { ActivityComponent } from './activity/activity.component';
import { UserComponent } from './setup/user/user.component';
import { LeadPrintDialogComponent } from './lead-detail/lead-print-dialog/lead-print-dialog.component';
import { ProductComponent } from './setup/product/product.component';
import { StatusComponent } from './setup/status/status.component';
import { SalesDetailPrintDialogComponent } from './sales-detail/sales-detail-print-dialog/sales-detail-print-dialog.component';
import { SupportDetailPrintDialogComponent } from './support-detail/support-detail-print-dialog/support-detail-print-dialog.component';
import { LeadActivityPrintDialogComponent } from './lead-detail/lead-activity-print-dialog/lead-activity-print-dialog.component';
import { SalesDeliveryActivityPrintDialogComponent } from './sales-detail/sales-delivery-activity-print-dialog/sales-delivery-activity-print-dialog.component';
import { SupportDetailActivityPrintDialogComponent } from './support-detail/support-detail-activity-print-dialog/support-detail-activity-print-dialog.component';
import { SoftwareRouteReuseStrategy } from './software-route-reuse-strategy';
import { DocumentDeleteComponent } from './document/document-delete/document-delete.component';
import { LeadDocumentDetailComponent } from './document/lead-document-detail/lead-document-detail.component';
import { AttachmentComponent } from './attachment/attachment/attachment.component';
import { AttachmentDeleteComponent } from './attachment/attachment-delete/attachment-delete.component';
import { DocumentComponent } from './document/document/document.component';
import { LeadStaffReportComponent } from './report/lead-staff-report/lead-staff-report.component';
import { SalesDeliveryStaffReportComponent } from './report/sales-delivery-staff-report/sales-delivery-staff-report.component';
import { SupportStaffReportComponent } from './report/support-staff-report/support-staff-report.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    LeadComponent,
    LeadDetailComponent,
    SalesListComponent,
    SalesDetailComponent,
    SupportListComponent,
    SupportDetailComponent,
    LeadReportComponent,
    SalesdeliveryReportComponent,
    SupportReportComponent,
    ActivityReportComponent,
    ActivityComponent,
    UserComponent,
    LeadPrintDialogComponent,
    ProductComponent,
    StatusComponent,
    SalesDetailPrintDialogComponent,
    SupportDetailPrintDialogComponent,
    LeadActivityPrintDialogComponent,
    SalesDeliveryActivityPrintDialogComponent,
    SupportDetailActivityPrintDialogComponent,
    LeadDocumentDetailComponent,
    DocumentDeleteComponent,
    AttachmentComponent,
    AttachmentDeleteComponent,
    DocumentComponent,
    LeadStaffReportComponent,
    SalesDeliveryStaffReportComponent,
    SupportStaffReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SoftwareRoutingModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    WjGridFilterModule,
    WjGridModule,
    WjInputModule,
    ModalModule.forRoot(),
    PdfViewerModule,
    NgxDocViewerModule
  ],
  providers: [
    SoftwareRouterActivate,
  ],
  entryComponents: [
    LeadPrintDialogComponent,
    SalesDetailPrintDialogComponent,
    SupportDetailPrintDialogComponent,
    LeadActivityPrintDialogComponent,
    SalesDeliveryActivityPrintDialogComponent,
    SupportDetailActivityPrintDialogComponent,
    DocumentComponent,
    DocumentDeleteComponent,
    AttachmentComponent,
    AttachmentDeleteComponent
  ]
})
export class SoftwareModule { }
