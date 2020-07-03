import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { SupportStaffReportService } from './support-staff-report.service';

@Component({
  selector: 'app-support-staff-report',
  templateUrl: './support-staff-report.component.html',
  styleUrls: ['./support-staff-report.component.css']
})
export class SupportStaffReportComponent implements OnInit {

  constructor(private supportStaffReportService: SupportStaffReportService) { }

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

  public listSupportStaffReportObservableArray: ObservableArray = new ObservableArray();
  public listSupportStaffReportCollectionView: CollectionView = new CollectionView(this.listSupportStaffReportObservableArray);
  public listSupportStafReportPageIndex: number = 15;
  @ViewChild('listSupportStaffReportFlexGrid') listSupportStaffReportFlexGrid: WjFlexGrid;
  public isSupportStaffReportProgressBarHidden = false;
  public isSupportStaffReportDataLoaded: boolean = false;

  public listSupportStaffReportSub: any;

  public listSupportStaffQuotationReportObservableArray: ObservableArray = new ObservableArray();
  public listOpenSupportStaffReportCollectionView: CollectionView = new CollectionView(this.listSupportStaffQuotationReportObservableArray);
  public listOpenSupportStaffReportPageIndex: number = 15;
  @ViewChild('listOpenSupportStaffReportFlexGrid') listOpenSupportStaffReportFlexGrid: WjFlexGrid;
  public isOpenSupportStaffReportProgressBarHidden = false;
  public isOpenSupportStaffReportDataLoaded: boolean = false;

  public listOpenSupportStaffReportSub: any;

  public isSupportStaffReportTabClick: boolean = true;
  public isOpenSupportStaffReportTabClick: boolean = false;

  cboStartDateTextChanged() {

    if (this.isSupportStaffReportDataLoaded) {
      setTimeout(() => {
        this.listSalesStaffReport();
      }, 100);
    }

    if (this.isOpenSupportStaffReportTabClick == true) {
      if (this.isOpenSupportStaffReportDataLoaded) {
        this.isOpenSupportStaffReportDataLoaded = false;
        this.listSalesStaffQuotationReport();
      }
    }
  }

  cboEndDateTextChanged() {

    if (this.isSupportStaffReportDataLoaded) {
      setTimeout(() => {
        this.listSalesStaffReport();
      }, 100);
    }

    if (this.isOpenSupportStaffReportTabClick == true) {
      if (this.isOpenSupportStaffReportDataLoaded) {
        this.isOpenSupportStaffReportDataLoaded = false;

        this.listSalesStaffQuotationReport();
      }
    }
  }

  cboUserSelectedIndexChanged(selectedValue: any) {
    this.cboUserSelectedValue = selectedValue;

    if (this.isSupportStaffReportDataLoaded) {
      setTimeout(() => {
        this.listSalesStaffReport();
      }, 100);
    }

    if (this.isOpenSupportStaffReportTabClick == true) {
      if (this.isOpenSupportStaffReportDataLoaded) {
        this.isOpenSupportStaffReportDataLoaded = false;
        this.listSalesStaffQuotationReport();
      }
    }
  }

  // =============
  // ComboBox User
  // =============
  public createCboUser(): void {
    this.supportStaffReportService.listUser();
    this.cboListUserSub = this.supportStaffReportService.listUserObservable.subscribe(
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
    this.isOpenSupportStaffReportTabClick = false;
    setTimeout(() => {
      this.listSupportStaffReportCollectionView.refresh();
      this.listSupportStaffReportFlexGrid.refresh();
    }, 300);
  }

  public listSalesStaffReport(): void {
    this.listSupportStaffReportObservableArray = new ObservableArray();
    this.listSupportStaffReportCollectionView = new CollectionView(this.listSupportStaffReportObservableArray);
    this.listSupportStaffReportCollectionView.pageSize = 15;
    this.listSupportStaffReportCollectionView.trackChanges = true;
    this.listSupportStaffReportCollectionView.refresh();
    this.listSupportStaffReportFlexGrid.refresh();

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

    this.isSupportStaffReportProgressBarHidden = false;

    this.supportStaffReportService.listSupprtStaffReport(startDate, endDate, this.cboUserSelectedValue);
    this.listSupportStaffReportSub = this.supportStaffReportService.listSupportStaffReportObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSupportStaffReportObservableArray = data;
          this.listSupportStaffReportCollectionView = new CollectionView(this.listSupportStaffReportObservableArray);
          this.listSupportStaffReportCollectionView.pageSize = this.listSupportStafReportPageIndex;
          this.listSupportStaffReportCollectionView.trackChanges = true;
        }

        setTimeout(() => {
          this.listSupportStaffReportCollectionView.refresh();
          this.listSupportStaffReportFlexGrid.refresh();
          this.isSupportStaffReportDataLoaded = true;
          this.isSupportStaffReportProgressBarHidden = true;
          this.isOpenSupportStaffReportDataLoaded = false;
        }, 500);

        if (this.listSupportStaffReportSub != null) this.listSupportStaffReportSub.unsubscribe();
      }
    );
  }

  public listSalesStaffQuotationReport(): void {
    this.isOpenSupportStaffReportTabClick = true;
    setTimeout(() => {
      if (!this.isOpenSupportStaffReportDataLoaded) {
        this.listSupportStaffQuotationReportObservableArray = new ObservableArray();
        this.listOpenSupportStaffReportCollectionView = new CollectionView(this.listSupportStaffQuotationReportObservableArray);
        this.listOpenSupportStaffReportCollectionView.pageSize = 15;
        this.listOpenSupportStaffReportCollectionView.trackChanges = true;
        this.listOpenSupportStaffReportCollectionView.refresh();
        this.listOpenSupportStaffReportFlexGrid.refresh();

        let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
        let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

        this.isOpenSupportStaffReportProgressBarHidden = false;

        this.supportStaffReportService.listOpenSupportStaffReport(startDate, endDate, this.cboUserSelectedValue);
        this.listSupportStaffReportSub = this.supportStaffReportService.listOpenSupportReportObservable.subscribe(
          data => {
            if (data.length > 0) {
              this.listSupportStaffQuotationReportObservableArray = data;
              this.listOpenSupportStaffReportCollectionView = new CollectionView(this.listSupportStaffQuotationReportObservableArray);
              this.listOpenSupportStaffReportCollectionView.pageSize = this.listOpenSupportStaffReportPageIndex;
              this.listOpenSupportStaffReportCollectionView.trackChanges = true;
            }
            setTimeout(() => {
              this.listOpenSupportStaffReportCollectionView.refresh();
              this.listOpenSupportStaffReportFlexGrid.refresh();
              this.isOpenSupportStaffReportDataLoaded = true;
              this.isOpenSupportStaffReportProgressBarHidden = true;
            }, 300);

            if (this.listOpenSupportStaffReportSub != null) this.listOpenSupportStaffReportSub.unsubscribe();
          }
        );
      }
    }, 300);
  }

  ngOnDestroy() {
    if (this.listOpenSupportStaffReportSub != null) this.listOpenSupportStaffReportSub.unsubscribe();
    if (this.listSupportStaffReportSub != null) this.listSupportStaffReportSub.unsubscribe();
    if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
  }

}
