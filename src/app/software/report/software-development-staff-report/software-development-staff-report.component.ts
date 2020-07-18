import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { SoftwareDevelopmentStaffReportService } from './software-development-staff-report.service'

@Component({
  selector: 'app-software-development-staff-report',
  templateUrl: './software-development-staff-report.component.html',
  styleUrls: ['./software-development-staff-report.component.css']
})
export class SoftwareDevelopmentStaffReportComponent implements OnInit {

  constructor(private softwareDevelopmentStaffReportService: SoftwareDevelopmentStaffReportService) { }

  public startDateFilterData = new Date();
  public endDateFilterData = new Date();

  public cboUserObservableArray: ObservableArray = new ObservableArray();
  public cboUserSelectedValue: number = 0;
  public cboListUserSub: any;

  public isContentHidden: boolean = false;
  public isLoadingSpinnerHidden: boolean = true;

  public listSoftwareDevelopmentStaffReportObservableArray: ObservableArray = new ObservableArray();
  public listSoftwareDevelopmentStaffReportCollectionView: CollectionView = new CollectionView(this.listSoftwareDevelopmentStaffReportObservableArray);
  public listSoftwareDevelopmentStafReportPageIndex: number = 15;
  @ViewChild('listSoftwareDevelopmentStaffReportFlexGrid') listSoftwareDevelopmentStaffReportFlexGrid: WjFlexGrid;
  public isSoftwareDevelopmentDeliveryReportProgressBarHidden = false;
  public isSoftwareDevelopmentStaffReportDataLoaded: boolean = false;

  public listSoftwareDevelopmentStaffReportSub: any;

  public listOpenSoftwareDevelopmentStaffReportObservableArray: ObservableArray = new ObservableArray();
  public listOpenSoftwareDevelopmentStaffReportCollectionView: CollectionView = new CollectionView(this.listOpenSoftwareDevelopmentStaffReportObservableArray);
  public listOpenSoftwareDevelopmentStafReportPageIndex: number = 15;
  @ViewChild('listOpenSoftwareDevelopmentStaffReportFlexGrid') listOpenSoftwareDevelopmentStaffReportFlexGrid: WjFlexGrid;
  public isOpenSoftwareDevelopmentStaffReportProgressBarHidden = false;
  public isOpenSoftwareDevelopmentStaffReportDataLoaded: boolean = false;

  public listOpenSoftwareDevelopmentStaffReportSub: any;

  public isListSoftwareDevelopmentStaffReportFocus: boolean = true;
  public isListOpenSoftwareDevelopmentStaffReportFocus: boolean = false;

  ngOnInit() {
    this.createCboUser();
  }

  // =============
  // ComboBox User
  // =============
  public async createCboUser() {
    this.cboListUserSub = await (await this.softwareDevelopmentStaffReportService.ListUser()).subscribe(
      data => {
        let results = data;
        let userObservableArray = new ObservableArray();
        if (results["length"] > 1) {
          userObservableArray.push({
            Id: 0,
            UserName: '',
            FullName: 'All Users'
          });
        }

        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            userObservableArray.push({
              Id: data[i].Id,
              UserName: data[i].UserName,
              FullName: data[i].FullName
            });
          }
        }

        this.cboUserObservableArray = userObservableArray;
      }
    );

    this.listSoftwareDevelopmentStaffReport();
  }

  cboStartDateTextChanged() {
    if (this.isSoftwareDevelopmentStaffReportDataLoaded) {
      if (this.isListSoftwareDevelopmentStaffReportFocus == true) {
        this.isSoftwareDevelopmentStaffReportDataLoaded = false;
        this.listSoftwareDevelopmentStaffReport();
      }
    }

    if (this.isOpenSoftwareDevelopmentStaffReportDataLoaded) {
      if (this.isListOpenSoftwareDevelopmentStaffReportFocus == true) {
        this.isOpenSoftwareDevelopmentStaffReportDataLoaded = false;
        this.listOpenSoftwareDevelopmentStaffReport();
      }
    }
  }

  cboEndDateTextChanged() {
    if (this.isSoftwareDevelopmentStaffReportDataLoaded) {
      if (this.isListSoftwareDevelopmentStaffReportFocus == true) {
        this.isSoftwareDevelopmentStaffReportDataLoaded = false;
        this.listSoftwareDevelopmentStaffReport();
      }
    }

    if (this.isOpenSoftwareDevelopmentStaffReportDataLoaded) {
      if (this.isListOpenSoftwareDevelopmentStaffReportFocus == true) {
        this.isOpenSoftwareDevelopmentStaffReportDataLoaded = false;
        this.listOpenSoftwareDevelopmentStaffReport();
      }
    }
  }

  cboUserSelectedIndexChanged(selectedValue: any) {
    this.cboUserSelectedValue = selectedValue;

    if (this.isSoftwareDevelopmentStaffReportDataLoaded) {
      if (this.isListSoftwareDevelopmentStaffReportFocus == true) {
        this.isSoftwareDevelopmentStaffReportDataLoaded = false;
        this.listSoftwareDevelopmentStaffReport();
      }
    }

    if (this.isOpenSoftwareDevelopmentStaffReportDataLoaded) {
      if (this.isListOpenSoftwareDevelopmentStaffReportFocus == true) {
        this.isOpenSoftwareDevelopmentStaffReportDataLoaded = false;
        this.listOpenSoftwareDevelopmentStaffReport();
      }
    }
  }

  refreshlistSoftwareDevelopmentStaffReport() {
    this.isListSoftwareDevelopmentStaffReportFocus = true;
    this.isListOpenSoftwareDevelopmentStaffReportFocus = false;

    setTimeout(() => {
      this.listSoftwareDevelopmentStaffReportCollectionView.refresh();
      this.listSoftwareDevelopmentStaffReportFlexGrid.refresh();
    }, 300);
  }

  refreshlistOpenSoftwareDevelopmentStaffReport() {
    this.isListSoftwareDevelopmentStaffReportFocus = false;
    this.isListOpenSoftwareDevelopmentStaffReportFocus = true;

    setTimeout(() => {
      this.listOpenSoftwareDevelopmentStaffReportCollectionView.refresh();
      this.listOpenSoftwareDevelopmentStaffReportFlexGrid.refresh();
    }, 300);
  }

  public async listSoftwareDevelopmentStaffReport() {
    this.listSoftwareDevelopmentStaffReportObservableArray = new ObservableArray();
    this.listSoftwareDevelopmentStaffReportCollectionView = new CollectionView(this.listSoftwareDevelopmentStaffReportObservableArray);
    this.listSoftwareDevelopmentStaffReportCollectionView.pageSize = 15;
    this.listSoftwareDevelopmentStaffReportCollectionView.trackChanges = true;
    this.listSoftwareDevelopmentStaffReportCollectionView.refresh();
    this.listSoftwareDevelopmentStaffReportFlexGrid.refresh();

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

    this.isSoftwareDevelopmentDeliveryReportProgressBarHidden = false;

    this.listSoftwareDevelopmentStaffReportSub = await (await this.softwareDevelopmentStaffReportService.ListSoftwareDevelopmentStaffReport(startDate, endDate, this.cboUserSelectedValue)).subscribe(
      data => {
        let results = data;
        let softwareDevelopmentStaffListObservableArray = new ObservableArray();

        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            softwareDevelopmentStaffListObservableArray.push({
              Staff: results[i].Staff,
              Open: results[i].Open,
              Close: results[i].Close,
              Cancelled: results[i].Cancelled,
              Total: results[i].Total
            });
          }

          this.listSoftwareDevelopmentStaffReportObservableArray = softwareDevelopmentStaffListObservableArray;
          this.listSoftwareDevelopmentStaffReportCollectionView = new CollectionView(this.listSoftwareDevelopmentStaffReportObservableArray);
          this.listSoftwareDevelopmentStaffReportCollectionView.pageSize = 15;
          this.listSoftwareDevelopmentStaffReportCollectionView.trackChanges = true;
          this.listSoftwareDevelopmentStaffReportCollectionView.refresh();
          this.listSoftwareDevelopmentStaffReportFlexGrid.refresh();
        }

        setTimeout(() => {
          this.listSoftwareDevelopmentStaffReportCollectionView.refresh();
          this.listSoftwareDevelopmentStaffReportFlexGrid.refresh();
          this.isSoftwareDevelopmentStaffReportDataLoaded = true;
          this.isSoftwareDevelopmentDeliveryReportProgressBarHidden = true;

          if (this.isListOpenSoftwareDevelopmentStaffReportFocus == false) {
            this.listOpenSoftwareDevelopmentStaffReport();
          }

        }, 500);

        if (this.listSoftwareDevelopmentStaffReportSub != null) this.listSoftwareDevelopmentStaffReportSub.unsubscribe();
      }
    );
  }

  public async listOpenSoftwareDevelopmentStaffReport() {
    this.listOpenSoftwareDevelopmentStaffReportObservableArray = new ObservableArray();
    this.listOpenSoftwareDevelopmentStaffReportCollectionView = new CollectionView(this.listOpenSoftwareDevelopmentStaffReportObservableArray);
    this.listOpenSoftwareDevelopmentStaffReportCollectionView.pageSize = 15;
    this.listOpenSoftwareDevelopmentStaffReportCollectionView.trackChanges = true;
    this.listOpenSoftwareDevelopmentStaffReportCollectionView.refresh();
    this.listOpenSoftwareDevelopmentStaffReportFlexGrid.refresh();

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

    this.isOpenSoftwareDevelopmentStaffReportProgressBarHidden = false;

    this.listSoftwareDevelopmentStaffReportSub = await (await this.softwareDevelopmentStaffReportService.ListOpenSoftwareDevelopmentStaffReport(startDate, endDate, this.cboUserSelectedValue)).subscribe(
      data => {
        let results = data;
        let openSoftwareDevelopmentStaffListObservableArray = new ObservableArray();

        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            openSoftwareDevelopmentStaffListObservableArray.push({
              SDNumber: results[i].SDNumber,
              SDDate: results[i].SDDate,
              ProductDescription: results[i].ProductDescription,
              Issue: results[i].Issue,
              IssueType: results[i].IssueType,
              AssignedToUserFullname: results[i].AssignedToUserFullname,
              TargetDateTime: results[i].TargetDateTime,
              CloseDateTime: results[i].CloseDateTime,
              Status: results[i].Status
            });
          }

          this.listOpenSoftwareDevelopmentStaffReportObservableArray = openSoftwareDevelopmentStaffListObservableArray;
          this.listOpenSoftwareDevelopmentStaffReportCollectionView = new CollectionView(this.listOpenSoftwareDevelopmentStaffReportObservableArray);
          this.listOpenSoftwareDevelopmentStaffReportCollectionView.pageSize = 15;
          this.listOpenSoftwareDevelopmentStaffReportCollectionView.trackChanges = true;
          this.listOpenSoftwareDevelopmentStaffReportCollectionView.refresh();
          this.listOpenSoftwareDevelopmentStaffReportFlexGrid.refresh();
        }

        setTimeout(() => {
          this.listOpenSoftwareDevelopmentStaffReportCollectionView.refresh();
          this.listOpenSoftwareDevelopmentStaffReportFlexGrid.refresh();
          this.isOpenSoftwareDevelopmentStaffReportDataLoaded = true;
          this.isOpenSoftwareDevelopmentStaffReportProgressBarHidden = true;

          if (this.isListSoftwareDevelopmentStaffReportFocus == false) {
            this.listSoftwareDevelopmentStaffReport();
          }
          this.listSoftwareDevelopmentStaffReportCollectionView.refresh();
          this.listSoftwareDevelopmentStaffReportFlexGrid.refresh();
        }, 300);

        if (this.listOpenSoftwareDevelopmentStaffReportSub != null) this.listOpenSoftwareDevelopmentStaffReportSub.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    if (this.listOpenSoftwareDevelopmentStaffReportSub != null) this.listOpenSoftwareDevelopmentStaffReportSub.unsubscribe();
    if (this.listSoftwareDevelopmentStaffReportSub != null) this.listSoftwareDevelopmentStaffReportSub.unsubscribe();
    if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
  }
}
