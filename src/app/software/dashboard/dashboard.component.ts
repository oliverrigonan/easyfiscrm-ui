import { Component, OnInit, ViewChild } from '@angular/core';
import { SecurityService } from '../security/security.service';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { DashboardService } from './dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
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
  ) { }

  public userGroup: String = "";

  public startDateFilterData = new Date();
  public endDateFilterData = new Date();

  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public listTrnSummaryObservableArray: ObservableArray = new ObservableArray();
  public listTrnSummaryFilterByStatusObservableArray: ObservableArray = new ObservableArray();
  public listTrnSummarySub: any;
  public listTrnSummaryPerStatusSub: any;

  public cboUserObservableArray: ObservableArray = new ObservableArray();
  public cboUserSelectedValue: number = 0;
  public cboListUserSub: any;

  public chart: any;

  ngAfterViewInit() {
  }

  public getFirsDayOftheMonth() {
    var date = new Date();
    this.startDateFilterData = new Date(date.getFullYear(), date.getMonth(), 1);
    this.endDateFilterData = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }



  public cboStartDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.pieChart();
      }, 100);
    }
  }

  public cboEndDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.pieChart();
      }, 100);
    }
  }

  public emptyList() {
    this.listTrnSummaryFilterByStatusObservableArray = null;
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
          if (data.length > 1) {
            userObservableArray.push({
              Id: 0,
              UserName: '',
              FullName: 'All Users'
            });
          }
          for (var i = 0; i <= data.length - 1; i++) {
            userObservableArray.push({
              Id: data[i].Id,
              UserName: data[i].UserName,
              FullName: data[i].FullName
            });
          }
        }

        this.cboUserObservableArray = userObservableArray;
        setTimeout(() => { this.pieChart(); }, 100);
      }
    );
  }

  public cboUserSelectedIndexChanged(selectedValue: any): void {
    this.cboUserSelectedValue = selectedValue;
    if (this.isDataLoaded) {
      this.pieChart();
    }
  }

  public OnClickDiv(): void {

  }

  public pieChart(): void {
    this.chart = am4core.create("chartdiv", am4charts.PieChart);

    this.chart.data = this.listTrnSummaryObservableArray;
    this.chart.radius = am4core.percent(95)

    // Add and configure Series
    let pieSeries = this.chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "NoOfTransaction";
    pieSeries.dataFields.category = "Document";
    pieSeries.legendSettings.itemValueText = "{value} - ({value.percent.formatNumber('#.00')}%)";
    pieSeries.colors.step = 2;

    pieSeries.slices.template.propertyFields.isActive = "pulled";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    this.chart.legend = new am4charts.Legend();
    this.chart.legend.valueLabels.template.align = "left";
    this.chart.legend.valueLabels.template.textAlign = "end";
    this.chart.legend.position = "right";

    // this.chart.legend.itemContainers.template.events.on("hit", function (ev) {
    //   console.log("Clicked on", ev.target);
    // });

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');
    let userId = this.cboUserSelectedValue == null ? 0 : this.cboUserSelectedValue;
    this.dashboardService.listTransactionSummary(startDate, endDate, userId);

    this.listTrnSummarySub = this.dashboardService.listTrnSummaryObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.chart.data = data;
        } else {
          this.chart.data = [];
        }

        this.isDataLoaded = true;

        setTimeout(() => {
          this.listTrnSummary();
        }, 100);
      }
    );
  }

  public listTrnSummary(): void {
    this.emptyList();
    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');
    let userId = this.cboUserSelectedValue == null ? 0 : this.cboUserSelectedValue;

    this.dashboardService.listTransactionFilterByStatusSummary(startDate, endDate, userId);

    this.listTrnSummaryPerStatusSub = this.dashboardService.listTrnSummaryPerStatusObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listTrnSummaryFilterByStatusObservableArray = data;
          this.isDataLoaded = true;
        }
      }
    );
  }

  public goToLeadList(objLeadFilter: any) {
    let dateStart = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let dateEnd = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');
    this.router.navigate(['/software/trn/lead/', dateStart, dateEnd, objLeadFilter.Status, this.cboUserSelectedValue, true]);
  }

  public goToSalesDeliveryList(objSalesDeliveryFilter: any) {
    let dateStart = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let dateEnd = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');
    this.router.navigate(['/software/trn/sales/', dateStart, dateEnd, objSalesDeliveryFilter.Status, this.cboUserSelectedValue, true]);
  }

  public goToSupportList(objSupportFilter: any) {
    let dateStart = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let dateEnd = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');
    this.router.navigate(['/software/trn/support/', dateStart, dateEnd, objSupportFilter.Status, this.cboUserSelectedValue, true]);
  }

  ngOnInit() {
    let username = localStorage.getItem("username");

    setTimeout(() => {
      if (this.securityService.openGroupPage("Lead") == true) {
        this.crmLead = true;
      }
      if (this.securityService.openGroupPage("Delivery") == true) {
        this.crmSalesDelivery = true;
      }
      if (this.securityService.openGroupPage("Support") == true) {
        this.crmSupport = true;
      }
      if (this.securityService.openGroupPage("Activity") == true) {
        this.crmActivity = true;
      }
      if (this.securityService.openGroupPage("Report") == true) {
        this.crmReport = true;
      }
      if (this.securityService.openGroupPage("Admin") == true) {
        this.crmAdmin = true;
      }
    }, 1000);
    
    this.getFirsDayOftheMonth();
    this.createCboUser();
  }


  ngOnDestroy() {
    if (this.listTrnSummaryPerStatusSub != null) this.listTrnSummarySub.unsubscribe();
    if (this.listTrnSummarySub != null) this.listTrnSummarySub.unsubscribe();
    if (this.listTrnSummarySub != null) this.chart.disposed();
    if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
  }

}
