import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private crmLead: boolean = false;
  private crmSalesDelivery: boolean = false;
  private crmSupport: boolean = false;
  private crmActivity: boolean = false;
  private crmReport: boolean = false;
  private crmAdmin: boolean = false;

  constructor(
    private securityService: SecurityService,
    private dashboardService: DashboardService
  ) { }


  public leadStartDateFilterData = new Date();
  public leadEndDateFilterData = new Date();

  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public listLeadSummaryObservableArray: ObservableArray = new ObservableArray();
  public listLeadSummarySub: any;

  public listSalesDeliverySummaryObservableArray: ObservableArray = new ObservableArray();
  public listSalesDeliverySummarySub: any;

  public listSupportSummaryObservableArray: ObservableArray = new ObservableArray();
  public listSupportSummarySub: any;

  public getFirsDayOftheMonth() {
    var date = new Date();
    this.leadStartDateFilterData = new Date(date.getFullYear(), date.getMonth(), 1);
    this.leadEndDateFilterData = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  public cboStartDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listLeadSummary();
        this.listSalesDeliverySummary();
        this.listSupportSummary();
      }, 100);
    }
  }

  public cboEndDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listLeadSummary();
        this.listSalesDeliverySummary();
        this.listSupportSummary();
      }, 100);
    }
  }

  public listLeadSummary(): void {

    let startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

    this.dashboardService.listLeadSummary(startDate, endDate);
    this.listLeadSummarySub = this.dashboardService.listLeadSummaryObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listLeadSummaryObservableArray = data;
          this.isDataLoaded = true;
        }
        if (this.listLeadSummarySub != null) this.listLeadSummarySub.unsubscribe();
      }
    );
  }

  public listSalesDeliverySummary(): void {

    let startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

    this.dashboardService.listSalesDeliverySummary(startDate, endDate);
    this.listSalesDeliverySummarySub = this.dashboardService.listSalesDeliverySummaryObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSalesDeliverySummaryObservableArray = data;
          this.isDataLoaded = true;
        }
        if (this.listSalesDeliverySummarySub != null) this.listSalesDeliverySummarySub.unsubscribe();
      }
    );
  }

  public listSupportSummary(): void {

    let startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

    this.dashboardService.listSupportSummary(startDate, endDate);
    this.listSupportSummarySub = this.dashboardService.listSupportSummaryObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSupportSummaryObservableArray = data;
          this.isDataLoaded = true;
        }
        if (this.listSupportSummarySub != null) this.listSupportSummarySub.unsubscribe();
      }
    );
  }

  ngOnInit() {
    if (this.securityService.openPage("CRMLead") == true) {
      this.crmLead = true;
    }
    if (this.securityService.openPage("CRMSalesDelivery") == true) {
      this.crmSalesDelivery = true;
    }
    if (this.securityService.openPage("CRMSupport") == true) {
      this.crmSupport = true;
    }
    if (this.securityService.openPage("CRMActivity") == true) {
      this.crmActivity = true;
    }
    if (this.securityService.openPage("CRMReport") == true) {
      this.crmReport = true;
    }
    if (this.securityService.openPage("CRMReport") == true) {
      this.crmReport = true;
    }
    if (this.securityService.openPage("CRMAdmin") == true) {
      this.crmAdmin = true;
    }
    this.getFirsDayOftheMonth();
    this.listLeadSummary();
    this.listSalesDeliverySummary();
    this.listSupportSummary();
  }

}
