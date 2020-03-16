import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { DashboardService } from './dashboard.service';
import { LeadComponent } from '../lead/lead.component';
import { Router, ActivatedRoute } from '@angular/router';


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
    private dashboardService: DashboardService,
    private router: Router,
    private LeadComponent: LeadComponent
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

  public cboUserObservableArray: ObservableArray = new ObservableArray();
  public cboUserSelectedValue: number = 0;
  public cboListUserSub: any;

  public getFirsDayOftheMonth() {
    var date = new Date();
    this.leadStartDateFilterData = new Date(date.getFullYear(), date.getMonth(), 1);
    this.leadEndDateFilterData = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  public emptyList() {
    this.listLeadSummaryObservableArray = null;
    this.listSupportSummaryObservableArray = null;
    this.listSalesDeliverySummaryObservableArray = null;
  }

  public cboStartDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listLeadSummary();
      }, 500);
    }
  }

  public cboEndDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listLeadSummary();
      }, 500);
    }
  }

  // =============
  // ComboBox User
  // =============
  public createCboUser(): void {
    this.dashboardService.listUser();
    this.cboListUserSub = this.dashboardService.listUserObservable.subscribe(
      data => {
        let userObservableArray = new ObservableArray();
        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            userObservableArray.push({
              Id: data[i].Id,
              UserName: data[i].UserName,
              FullName: data[i].FullName
            });
          }
        }

        this.cboUserObservableArray = userObservableArray;
        setTimeout(() => { this.listLeadSummary(); }, 100);
        if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
      }
    );
  }

  public cboUserSelectedIndexChanged(selectedValue: any): void {
    this.cboUserSelectedValue = selectedValue;
    console.log(this.isDataLoaded);
    if (this.isDataLoaded) {
      this.listLeadSummary();
    }
  }

  public listLeadSummary(): void {
    this.emptyList();
    let startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

    this.dashboardService.listLeadSummary(startDate, endDate, this.cboUserSelectedValue);
    this.listLeadSummarySub = this.dashboardService.listLeadSummaryObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listLeadSummaryObservableArray = data;
          this.isDataLoaded = true;
        }
        setTimeout(() => { this.listSalesDeliverySummary() }, 100);
        if (this.listLeadSummarySub != null) this.listLeadSummarySub.unsubscribe();
      }
    );
  }

  public listSalesDeliverySummary(): void {

    let startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

    this.dashboardService.listSalesDeliverySummary(startDate, endDate, this.cboUserSelectedValue);
    this.listSalesDeliverySummarySub = this.dashboardService.listSalesDeliverySummaryObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSalesDeliverySummaryObservableArray = data;
          this.isDataLoaded = true;
        }
        setTimeout(() => { this.listSupportSummary() }, 100);

        if (this.listSalesDeliverySummarySub != null) this.listSalesDeliverySummarySub.unsubscribe();
      }
    );
  }

  public listSupportSummary(): void {

    let startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

    this.dashboardService.listSupportSummary(startDate, endDate, this.cboUserSelectedValue);
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

  public goToLeadList(objLeadFilter: any) {
    let dateStart = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let dateEnd = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');
    this.router.navigate(['/software/trn/lead/', dateStart, dateEnd, objLeadFilter.Status, this.cboUserSelectedValue, true]);
  }

  public goToSalesDeliveryList(objSalesDeliveryFilter: any) {
    let dateStart = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let dateEnd = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');
    this.router.navigate(['/software/trn/sales/', dateStart, dateEnd, objSalesDeliveryFilter.Status, this.cboUserSelectedValue, true]);
  }

  public goToSupportList(objSupportFilter: any) {
    let dateStart = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let dateEnd = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');
    this.router.navigate(['/software/trn/support/', dateStart, dateEnd, objSupportFilter.Status, this.cboUserSelectedValue, true]);
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
    this.createCboUser();
  }

  ngOnDestroy() {
    if (this.listSupportSummarySub != null) this.listSupportSummarySub.unsubscribe();
    if (this.listSalesDeliverySummarySub != null) this.listSalesDeliverySummarySub.unsubscribe();
    if (this.listLeadSummarySub != null) this.listLeadSummarySub.unsubscribe();
    if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
  }

}
