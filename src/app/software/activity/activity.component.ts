import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ToastrService } from 'ngx-toastr';
import { ActivityService } from './activity.service';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  constructor(
    private activityService: ActivityService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.createCboActivityDocument();
    this.createCboActivityStatus();
  }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public ActivityStartDateFilterData = new Date();
  public ActivityEndDateFilterData = new Date();

  public cboActivityStatusObservableArray: ObservableArray = new ObservableArray();
  public cboActivityStatusSelectedValue: string = "Open";

  public cboActivityDocumentObservableArray: ObservableArray = new ObservableArray();
  public cboActivityDocumentSelectedValue: string = "Open";

  public listActivityObservableArray: ObservableArray = new ObservableArray();
  public listActivityHeaderCollectionView: CollectionView = new CollectionView(this.listActivityObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listActivityFlexGrid') listActivityFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public cboListDocumentSub: any;
  public cboListStatusSub: any;
  public listActivitySub: any;

  public createCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";

      if (i == 0) {
        rows = 15;
        rowsString = "Show 15";
      } else if (i == 1) {
        rows = 50;
        rowsString = "Show 50";
      } else if (i == 2) {
        rows = 100;
        rowsString = "Show 100";
      } else if (i == 3) {
        rows = 150;
        rowsString = "Show 150";
      } else {
        rows = 200;
        rowsString = "Show 200";
      }

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.listActivityPageIndex = selectedValue;

    this.listActivityHeaderCollectionView.pageSize = this.listActivityPageIndex;
    this.listActivityHeaderCollectionView.refresh();
    this.listActivityHeaderCollectionView.refresh();
  }

  public cboStartDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listActivity();
      }, 100);
    }
  }

  public cboEndDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listActivity();
      }, 100);
    }
  }

  public cboDocumentSelectedIndexChanged(selectedValue: any): void {
    this.cboActivityDocumentSelectedValue = selectedValue;

    if (this.isDataLoaded) {
      setTimeout(() => {
        this.createCboActivityStatus();
      }, 100);
    }
  }

  public createCboActivityDocument(): void {
    this.activityService.listDocument();
    this.cboListDocumentSub = this.activityService.listDocumentObservable.subscribe(
      data => {
        let documentObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            documentObservableArray.push({
              Id: data[i].Id,
              Category: data[i].Category
            });
          }
        }

        this.cboActivityDocumentObservableArray = documentObservableArray;
        if (this.cboActivityDocumentObservableArray.length > 0) {
          setTimeout(() => {
            this.listActivity();
          }, 100);
        }

        if (this.cboListDocumentSub != null) this.cboListDocumentSub.unsubscribe();
      }
    );
  }

  public createCboActivityStatus(): void {
    this.activityService.listStatus(this.cboActivityDocumentSelectedValue);
    this.cboListStatusSub = this.activityService.listStatusObservable.subscribe(
      data => {
        let statusObservableArray = new ObservableArray();

        statusObservableArray.push({
          Id: 0,
          Status: "ALL"
        });

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            statusObservableArray.push({
              Id: data[i].Id,
              Status: data[i].Status
            });
          }
        }

        console.log("Good!");

        this.cboActivityStatusObservableArray = statusObservableArray;
        if (this.cboActivityStatusObservableArray.length > 0) {
          setTimeout(() => {
            this.listActivity();
          }, 100);
        }

        if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
      }
    );
  }

  public cboActivityStatusSelectedIndexChanged(selectedValue: any): void {
    this.cboActivityStatusSelectedValue = selectedValue;

    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listActivity();
      }, 100);
    }
  }

  public listActivity(): void {
    this.listActivityObservableArray = new ObservableArray();
    this.listActivityHeaderCollectionView = new CollectionView(this.listActivityObservableArray);
    this.listActivityHeaderCollectionView.pageSize = 15;
    this.listActivityHeaderCollectionView.trackChanges = true;
    this.listActivityHeaderCollectionView.refresh();
    this.listActivityFlexGrid.refresh();

    let startDate = [this.ActivityStartDateFilterData.getFullYear(), this.ActivityStartDateFilterData.getMonth() + 1, this.ActivityStartDateFilterData.getDate()].join('-');
    let endDate = [this.ActivityEndDateFilterData.getFullYear(), this.ActivityEndDateFilterData.getMonth() + 1, this.ActivityEndDateFilterData.getDate()].join('-');

    this.isProgressBarHidden = false;

    this.activityService.listActivityHeader(startDate, endDate, this.cboActivityDocumentSelectedValue, this.cboActivityStatusSelectedValue);
    this.listActivitySub = this.activityService.listActivityObservable.subscribe(
      data => {
        console.log(data);
        if (data.length > 0) {
          this.listActivityObservableArray = data;
          this.listActivityHeaderCollectionView = new CollectionView(this.listActivityObservableArray);
          this.listActivityHeaderCollectionView.pageSize = this.listActivityPageIndex;
          this.listActivityHeaderCollectionView.trackChanges = true;
          this.listActivityHeaderCollectionView.refresh();
          this.listActivityFlexGrid.refresh();
        }

        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.cboListDocumentSub != null) this.cboListDocumentSub.unsubscribe();
    if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
  }
}
