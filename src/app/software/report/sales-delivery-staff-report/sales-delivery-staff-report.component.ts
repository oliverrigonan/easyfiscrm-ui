import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ToastrService } from 'ngx-toastr';
import { SalesDeliveryStaffReportService } from './sales-delivery-staff-report.service';
@Component({
  selector: 'app-sales-delivery-staff-report',
  templateUrl: './sales-delivery-staff-report.component.html',
  styleUrls: ['./sales-delivery-staff-report.component.css']
})
export class SalesDeliveryStaffReportComponent implements OnInit {

  constructor(private salesDeliveryStaffReportService: SalesDeliveryStaffReportService) { }

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

  public listSalesDeliveryStaffReportObservableArray: ObservableArray = new ObservableArray();
  public listSalesDeliveryStaffReportCollectionView: CollectionView = new CollectionView(this.listSalesDeliveryStaffReportObservableArray);
  public listSalesDeliveryStafReportPageIndex: number = 15;
  @ViewChild('listSalesDeliveryStaffReportFlexGrid') listSalesDeliveryStaffReportFlexGrid: WjFlexGrid;
  public isSalesStaffDeliveryReportProgressBarHidden = false;
  public isSalesDeliveryStaffReportDataLoaded: boolean = false;

  public listSalesDeliveryStaffReportSub: any;

  public listOpenSalesDeliveryStaffReportObservableArray: ObservableArray = new ObservableArray();
  public listOpenSalesDeliveryStaffReportCollectionView: CollectionView = new CollectionView(this.listOpenSalesDeliveryStaffReportObservableArray);
  public listOpenSalesDeliveryStafReportPageIndex: number = 15;
  @ViewChild('listOpenSalesDeliveryStaffReportFlexGrid') listOpenSalesDeliveryStaffReportFlexGrid: WjFlexGrid;
  public isOpenSalesDeliveryStaffReportProgressBarHidden = false;
  public isOpenSalesDeliveryStaffReportDataLoaded: boolean = false;

  public listOpenSalesDeliveryStaffReportSub: any;

  public isLisSalesDeliveryStaffReportFocus: boolean = true;
  public isListOpenSalesDeliveryStaffReportFocus: boolean = false;

  cboStartDateTextChanged() {
    if (this.isSalesDeliveryStaffReportDataLoaded) {
      if (this.isLisSalesDeliveryStaffReportFocus == true) {
        this.isSalesDeliveryStaffReportDataLoaded = false;
        this.listSalesDeliveryStaffReport();
      }
    }

    if (this.isOpenSalesDeliveryStaffReportDataLoaded) {
      if (this.isListOpenSalesDeliveryStaffReportFocus == true) {
        this.isOpenSalesDeliveryStaffReportDataLoaded = false;
        this.listOpenSalesDeliveryStaffReport();
      }
    }
  }

  cboEndDateTextChanged() {
    if (this.isSalesDeliveryStaffReportDataLoaded) {
      if (this.isLisSalesDeliveryStaffReportFocus == true) {
        this.isSalesDeliveryStaffReportDataLoaded = false;
        this.listSalesDeliveryStaffReport();
      }
    }

    if (this.isOpenSalesDeliveryStaffReportDataLoaded) {
      if (this.isListOpenSalesDeliveryStaffReportFocus == true) {
        this.isOpenSalesDeliveryStaffReportDataLoaded = false;
        this.listOpenSalesDeliveryStaffReport();
      }
    }
  }

  cboUserSelectedIndexChanged(selectedValue: any) {
    this.cboUserSelectedValue = selectedValue;

    if (this.isSalesDeliveryStaffReportDataLoaded) {
      if (this.isLisSalesDeliveryStaffReportFocus == true) {
        this.isSalesDeliveryStaffReportDataLoaded = false;
        this.listSalesDeliveryStaffReport();
      }
    }

    if (this.isOpenSalesDeliveryStaffReportDataLoaded) {
      if (this.isListOpenSalesDeliveryStaffReportFocus == true) {
        this.isOpenSalesDeliveryStaffReportDataLoaded = false;
        this.listOpenSalesDeliveryStaffReport();
      }
    }
  }

  // =============
  // ComboBox User
  // =============
  public createCboUser(): void {
    this.salesDeliveryStaffReportService.listUser();
    this.cboListUserSub = this.salesDeliveryStaffReportService.listUserObservable.subscribe(
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

        setTimeout(() => {
          this.listSalesDeliveryStaffReport();
        }, 100);
      }
    );
  }

  refreshlistSalesDeliveryStaffReport() {
    this.isLisSalesDeliveryStaffReportFocus = true;
    this.isListOpenSalesDeliveryStaffReportFocus = false;

    setTimeout(() => {
      this.listSalesDeliveryStaffReportCollectionView.refresh();
      this.listSalesDeliveryStaffReportFlexGrid.refresh();
    }, 300);
  }

  refreshlistSOpenalesDeliveryStaffReport() {
    this.isLisSalesDeliveryStaffReportFocus = false;
    this.isListOpenSalesDeliveryStaffReportFocus = true;

    setTimeout(() => {
      this.listOpenSalesDeliveryStaffReportCollectionView.refresh();
      this.listOpenSalesDeliveryStaffReportFlexGrid.refresh();
    }, 300);
  }

  public listSalesDeliveryStaffReport(): void {
    this.listSalesDeliveryStaffReportObservableArray = new ObservableArray();
    this.listSalesDeliveryStaffReportCollectionView = new CollectionView(this.listSalesDeliveryStaffReportObservableArray);
    this.listSalesDeliveryStaffReportCollectionView.pageSize = 15;
    this.listSalesDeliveryStaffReportCollectionView.trackChanges = true;
    this.listSalesDeliveryStaffReportCollectionView.refresh();
    this.listSalesDeliveryStaffReportFlexGrid.refresh();

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

    this.isSalesStaffDeliveryReportProgressBarHidden = false;

    this.salesDeliveryStaffReportService.listSalesDeliveryStaffReport(startDate, endDate, this.cboUserSelectedValue);
    this.listSalesDeliveryStaffReportSub = this.salesDeliveryStaffReportService.listSalesDeliverStaffReportObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSalesDeliveryStaffReportObservableArray = data;
          this.listSalesDeliveryStaffReportCollectionView = new CollectionView(this.listSalesDeliveryStaffReportObservableArray);
          this.listSalesDeliveryStaffReportCollectionView.pageSize = this.listSalesDeliveryStafReportPageIndex;
          this.listSalesDeliveryStaffReportCollectionView.trackChanges = true;
        }

        setTimeout(() => {
          this.listSalesDeliveryStaffReportCollectionView.refresh();
          this.listSalesDeliveryStaffReportFlexGrid.refresh();
          this.isSalesDeliveryStaffReportDataLoaded = true;
          this.isSalesStaffDeliveryReportProgressBarHidden = true;

          if (this.isListOpenSalesDeliveryStaffReportFocus == false) {
            this.listOpenSalesDeliveryStaffReport();
          }

        }, 500);

        if (this.listSalesDeliveryStaffReportSub != null) this.listSalesDeliveryStaffReportSub.unsubscribe();
      }
    );
  }

  public listOpenSalesDeliveryStaffReport(): void {
    this.listOpenSalesDeliveryStaffReportObservableArray = new ObservableArray();
    this.listOpenSalesDeliveryStaffReportCollectionView = new CollectionView(this.listOpenSalesDeliveryStaffReportObservableArray);
    this.listOpenSalesDeliveryStaffReportCollectionView.pageSize = 15;
    this.listOpenSalesDeliveryStaffReportCollectionView.trackChanges = true;
    this.listOpenSalesDeliveryStaffReportCollectionView.refresh();
    this.listOpenSalesDeliveryStaffReportFlexGrid.refresh();

    let startDate = [this.startDateFilterData.getFullYear(), this.startDateFilterData.getMonth() + 1, this.startDateFilterData.getDate()].join('-');
    let endDate = [this.endDateFilterData.getFullYear(), this.endDateFilterData.getMonth() + 1, this.endDateFilterData.getDate()].join('-');

    this.isOpenSalesDeliveryStaffReportProgressBarHidden = false;

    this.salesDeliveryStaffReportService.listOpenSalesDeliveryStaffReport(startDate, endDate, this.cboUserSelectedValue);
    this.listSalesDeliveryStaffReportSub = this.salesDeliveryStaffReportService.listOpenSalesDeliveryReportObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listOpenSalesDeliveryStaffReportObservableArray = data;
          this.listOpenSalesDeliveryStaffReportCollectionView = new CollectionView(this.listOpenSalesDeliveryStaffReportObservableArray);
          this.listOpenSalesDeliveryStaffReportCollectionView.pageSize = this.listOpenSalesDeliveryStafReportPageIndex;
          this.listOpenSalesDeliveryStaffReportCollectionView.trackChanges = true;
        }
        setTimeout(() => {
          this.listOpenSalesDeliveryStaffReportCollectionView.refresh();
          this.listOpenSalesDeliveryStaffReportFlexGrid.refresh();
          this.isOpenSalesDeliveryStaffReportDataLoaded = true;
          this.isOpenSalesDeliveryStaffReportProgressBarHidden = true;

          if (this.isLisSalesDeliveryStaffReportFocus == false) {
            this.listSalesDeliveryStaffReport();
          }
          this.listSalesDeliveryStaffReportCollectionView.refresh();
          this.listSalesDeliveryStaffReportFlexGrid.refresh();
        }, 300);

        if (this.listOpenSalesDeliveryStaffReportSub != null) this.listOpenSalesDeliveryStaffReportSub.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    if (this.listOpenSalesDeliveryStaffReportSub != null) this.listOpenSalesDeliveryStaffReportSub.unsubscribe();
    if (this.listSalesDeliveryStaffReportSub != null) this.listSalesDeliveryStaffReportSub.unsubscribe();
    if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
  }

}
