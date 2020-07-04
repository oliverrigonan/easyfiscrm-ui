import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { LeadStaffReportService } from '../lead-staff-report/lead-staff-report.service';

@Component({
  selector: 'app-lead-staff-report',
  templateUrl: './lead-staff-report.component.html',
  styleUrls: ['./lead-staff-report.component.css']
})
export class LeadStaffReportComponent implements OnInit {

  constructor(private leadStaffReportService: LeadStaffReportService) { }

  ngOnInit() {
    this.createCboUser();
  }

  public startDateFilterData = new Date();
  public endDateFilterData = new Date();

  public cboUserObservableArray: ObservableArray = new ObservableArray();
  public cboUserSelectedValue: number = 0;
  public cboListUserSub: any;

  public isContentHidden: boolean = false;
  public isLoadingSpinnerHidden: boolean = true;

  public listSalesStaffReportObservableArray: ObservableArray = new ObservableArray();
  public listSalesStaffReportCollectionView: CollectionView = new CollectionView(this.listSalesStaffReportObservableArray);
  public listSalesStafReportPageIndex: number = 15;
  @ViewChild('listSalesStaffReportFlexGrid') listSalesStaffReportFlexGrid: WjFlexGrid;
  public isSalesStaffReportProgressBarHidden = false;
  public isSalesStaffReportDataLoaded: boolean = false;

  public listSalesStaffReportSub: any;

  public listSalesStaffQuotationReportObservableArray: ObservableArray = new ObservableArray();
  public listSalesStaffQuotationReportCollectionView: CollectionView = new CollectionView(this.listSalesStaffQuotationReportObservableArray);
  public listSalesStafQuotationReportPageIndex: number = 15;
  @ViewChild('listSalesStaffQuotationReportFlexGrid') listSalesStaffQuotationReportFlexGrid: WjFlexGrid;
  public isSalesStaffQuotationReportProgressBarHidden = false;
  public isSalesStaffQuotationReportDataLoaded: boolean = false;

  public listSalesStaffQuotationReportSub: any;

  public isSalesStaffTabClick: boolean = true;
  public isSalesStaffQuotationTabClick: boolean = false;

  public isListSalesStaffQuotationReportFocus: boolean = false;
  public isListSalesStasffReportFocus: boolean = true;

  cboStartDateTextChanged() {
    if (this.isSalesStaffReportDataLoaded) {
      if (this.isListSalesStasffReportFocus == true) {
        this.isSalesStaffReportDataLoaded = false;
        this.listSalesStaffReport();
      }
    }

    if (this.isSalesStaffQuotationReportDataLoaded) {
      if (this.isListSalesStaffQuotationReportFocus == true) {
        this.isSalesStaffQuotationReportDataLoaded = false;
        this.listSalesStaffQuotationReport();
      }
    }

  }

  cboEndDateTextChanged() {
    if (this.isSalesStaffReportDataLoaded) {
      if (this.isListSalesStasffReportFocus == true) {
        this.isSalesStaffReportDataLoaded = false;
        this.listSalesStaffReport();
      }
    }

    if (this.isSalesStaffQuotationReportDataLoaded) {
      if (this.isListSalesStaffQuotationReportFocus == true) {
        this.isSalesStaffQuotationReportDataLoaded = false;
        this.listSalesStaffQuotationReport();
      }
    }
  }

  cboUserSelectedIndexChanged(selectedValue: any) {
    this.cboUserSelectedValue = selectedValue;

    if (this.isSalesStaffReportDataLoaded) {
      if (this.isListSalesStasffReportFocus == true) {
        this.isSalesStaffReportDataLoaded = false;
        this.listSalesStaffReport();
      }
    }

    if (this.isSalesStaffQuotationReportDataLoaded) {
      if (this.isListSalesStaffQuotationReportFocus == true) {
        this.isSalesStaffQuotationReportDataLoaded = false;
        this.listSalesStaffQuotationReport();
      }
    }
  }

  // =============
  // ComboBox User
  // =============
  public createCboUser(): void {
    this.leadStaffReportService.listUser();
    this.cboListUserSub = this.leadStaffReportService.listUserObservable.subscribe(
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

        console.log(userObservableArray);
        this.cboUserObservableArray = userObservableArray;

        setTimeout(() => {
          this.listSalesStaffReport();
        }, 100);
      }
    );
  }

  refreshlistSalesStaffReport() {
    this.isListSalesStasffReportFocus = true;
    this.isListSalesStaffQuotationReportFocus = false;

    setTimeout(() => {
      this.listSalesStaffReportCollectionView.refresh();
      this.listSalesStaffReportFlexGrid.refresh();
    }, 300);
  }


  public listSalesStaffReport(): void {
    this.listSalesStaffReportObservableArray = new ObservableArray();
    this.listSalesStaffReportCollectionView = new CollectionView(this.listSalesStaffReportObservableArray);
    this.listSalesStaffReportCollectionView.pageSize = 15;
    this.listSalesStaffReportCollectionView.trackChanges = true;
    this.listSalesStaffReportCollectionView.refresh();
    this.listSalesStaffReportFlexGrid.refresh();

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

    this.isSalesStaffReportProgressBarHidden = false;

    this.leadStaffReportService.listSalesStaffReport(startDate, endDate, this.cboUserSelectedValue);
    this.listSalesStaffReportSub = this.leadStaffReportService.listSalesStaffReportObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSalesStaffReportObservableArray = data;
          this.listSalesStaffReportCollectionView = new CollectionView(this.listSalesStaffReportObservableArray);
          this.listSalesStaffReportCollectionView.pageSize = this.listSalesStafReportPageIndex;
          this.listSalesStaffReportCollectionView.trackChanges = true;
        }

        setTimeout(() => {
          this.listSalesStaffReportCollectionView.refresh();
          this.listSalesStaffReportFlexGrid.refresh();
          this.isSalesStaffReportDataLoaded = true;
          this.isSalesStaffReportProgressBarHidden = true;

          if (this.isListSalesStaffQuotationReportFocus == false) {
            this.listSalesStaffQuotationReport();
          }
          this.listSalesStaffQuotationReportCollectionView.refresh();
          this.listSalesStaffQuotationReportFlexGrid.refresh();
        }, 500);

        if (this.listSalesStaffReportSub != null) this.listSalesStaffReportSub.unsubscribe();
      }
    );

  }

  refreshlistSalesStaffQuotationReport() {
    this.isListSalesStasffReportFocus = false;
    this.isListSalesStaffQuotationReportFocus = true;

    setTimeout(() => {
      this.listSalesStaffQuotationReportCollectionView.refresh();
      this.listSalesStaffQuotationReportFlexGrid.refresh();
    }, 300);
  }

  public listSalesStaffQuotationReport(): void {
    this.listSalesStaffQuotationReportObservableArray = new ObservableArray();
    this.listSalesStaffQuotationReportCollectionView = new CollectionView(this.listSalesStaffQuotationReportObservableArray);
    this.listSalesStaffQuotationReportCollectionView.pageSize = 15;
    this.listSalesStaffQuotationReportCollectionView.trackChanges = true;
    this.listSalesStaffQuotationReportCollectionView.refresh();
    this.listSalesStaffQuotationReportFlexGrid.refresh();

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

    this.isSalesStaffQuotationReportProgressBarHidden = false;

    this.leadStaffReportService.listSalesStaffQuotationReport(startDate, endDate, this.cboUserSelectedValue);
    this.listSalesStaffReportSub = this.leadStaffReportService.listSalesQuotationReportObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSalesStaffQuotationReportObservableArray = data;
          this.listSalesStaffQuotationReportCollectionView = new CollectionView(this.listSalesStaffQuotationReportObservableArray);
          this.listSalesStaffQuotationReportCollectionView.pageSize = this.listSalesStafQuotationReportPageIndex;
          this.listSalesStaffQuotationReportCollectionView.trackChanges = true;
        }
        setTimeout(() => {
          this.listSalesStaffQuotationReportCollectionView.refresh();
          this.listSalesStaffQuotationReportFlexGrid.refresh();
          this.isSalesStaffQuotationReportDataLoaded = true;
          this.isSalesStaffQuotationReportProgressBarHidden = true;

          if (this.isListSalesStasffReportFocus == false) {
            this.listSalesStaffReport();
          }
          this.listSalesStaffReportCollectionView.refresh();
          this.listSalesStaffReportFlexGrid.refresh();

        }, 300);

        if (this.listSalesStaffQuotationReportSub != null) this.listSalesStaffQuotationReportSub.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    if (this.listSalesStaffQuotationReportSub != null) this.listSalesStaffQuotationReportSub.unsubscribe();
    if (this.listSalesStaffReportSub != null) this.listSalesStaffReportSub.unsubscribe();
    if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
  }

}
