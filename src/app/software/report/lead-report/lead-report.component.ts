import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ToastrService } from 'ngx-toastr';
import { LeadReportService } from './lead-report.service';

@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html',
  styleUrls: ['./lead-report.component.css']
})
export class LeadReportComponent implements OnInit {

  constructor(
    private leadReportService: LeadReportService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public leadStartDateFilterData = new Date();
  public leadEndDateFilterData = new Date();

  public cboLeadStatusObservableArray: ObservableArray = new ObservableArray();
  public cboLeadStatusSelectedValue: string = "Open";

  public listLeadObservableArray: ObservableArray = new ObservableArray();
  public listLeadCollectionView: CollectionView = new CollectionView(this.listLeadObservableArray);
  public listLeadPageIndex: number = 15;
  @ViewChild('listLeadFlexGrid') listLeadFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public cboListStatusSub: any;
  public listLeadSub: any;

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
    this.listLeadPageIndex = selectedValue;

    this.listLeadCollectionView.pageSize = this.listLeadPageIndex;
    this.listLeadCollectionView.refresh();
    this.listLeadCollectionView.refresh();
  }

  public cboStartDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listLead();
      }, 100);
    }
  }

  public cboEndDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listLead();
      }, 100);
    }
  }

  public createCboLeadStatus(): void {
    this.leadReportService.listStatus();
    this.cboListStatusSub = this.leadReportService.listStatusObservable.subscribe(
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

        this.cboLeadStatusObservableArray = statusObservableArray;
        if (this.cboLeadStatusObservableArray.length > 0) {
          setTimeout(() => {
            this.listLead();
          }, 100);
        }

        if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
      }
    );
  }

  public cboLeadStatusSelectedIndexChanged(selectedValue: any): void {
    this.cboLeadStatusSelectedValue = selectedValue;

    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listLead();
      }, 100);
    }
  }

  public listLead(): void {
    this.listLeadObservableArray = new ObservableArray();
    this.listLeadCollectionView = new CollectionView(this.listLeadObservableArray);
    this.listLeadCollectionView.pageSize = 15;
    this.listLeadCollectionView.trackChanges = true;
    this.listLeadCollectionView.refresh();
    this.listLeadFlexGrid.refresh();

    let startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
    let endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

    this.isProgressBarHidden = false;

    this.leadReportService.listLead(startDate, endDate, this.cboLeadStatusSelectedValue);
    this.listLeadSub = this.leadReportService.listLeadObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listLeadObservableArray = data;
          this.listLeadCollectionView = new CollectionView(this.listLeadObservableArray);
          this.listLeadCollectionView.pageSize = this.listLeadPageIndex;
          this.listLeadCollectionView.trackChanges = true;
          this.listLeadCollectionView.refresh();
          this.listLeadFlexGrid.refresh();
        }

        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listLeadSub != null) this.listLeadSub.unsubscribe();
      }
    );
  }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.createCboLeadStatus();
  }

  public btnCSVReportClick(): void {
    var fileName = "";

    fileName = "report-lead.csv";

    var csvData = this.generateCSV();
    var csvURL = window.URL.createObjectURL(csvData);
    var tempLink = document.createElement('a');

    tempLink.href = csvURL;
    tempLink.setAttribute('download', fileName);
    tempLink.click();
  }

  public generateCSV(): Blob {
    var data = "";
    var collection;
    var fileName = "";

    data = 'Lead Summary Report' + '\r\n\n';
    collection = this.listLeadCollectionView;
    fileName = "report-soldUnit.csv";

    if (data != "") {
      var label = '';
      for (var s in collection.items[0]) {
        label += s + ',';
      }
      label = label.slice(0, -1);

      data += label + '\r\n';

      collection.moveToFirstPage();
      for (var p = 0; p < collection.pageCount; p++) {
        for (var i = 0; i < collection.items.length; i++) {
          var row = '';
          for (var s in collection.items[i]) {
            row += '"' + collection.items[i][s] + '",';
          }
          row.slice(0, row.length - 1);
          data += row + '\r\n';
        }
        collection.moveToNextPage();
      }
    }
    return new Blob([data], { type: 'text/csv;charset=utf-8;' });
  }

  ngOnDestroy() {
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.listLeadSub != null) this.listLeadSub.unsubscribe();
  }
}
