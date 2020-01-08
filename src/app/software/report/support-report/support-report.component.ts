import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SupportReportService } from './support-report.service';

@Component({
  selector: 'app-support-report',
  templateUrl: './support-report.component.html',
  styleUrls: ['./support-report.component.css']
})
export class SupportReportComponent implements OnInit {

  constructor(
    private supportReportService: SupportReportService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public supportStartDateFilterData = new Date();
  public supportEndDateFilterData = new Date();

  public cboSupportStatusObservableArray: ObservableArray = new ObservableArray();
  public cboSupportStatusSelectedValue: string = "Open";

  public listSupportObservableArray: ObservableArray = new ObservableArray();
  public listSupportCollectionView: CollectionView = new CollectionView(this.listSupportObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listSupportFlexGrid') listSupportFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public cboListStatusSub: any;
  public listSupportSub: any;

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

    this.listSupportCollectionView.pageSize = this.listActivityPageIndex;
    this.listSupportCollectionView.refresh();
    this.listSupportCollectionView.refresh();
  }

  public createCboSupportStatus(): void {
    this.supportReportService.listStatus();
    this.cboListStatusSub = this.supportReportService.listStatusObservable.subscribe(
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

        this.cboSupportStatusObservableArray = statusObservableArray;
        if (this.cboSupportStatusObservableArray.length > 0) {
          setTimeout(() => {
            this.listSupport();
          }, 100);
        }

        if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
      }
    );
  }

  public cboStartDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listSupport();
      }, 100);
    }
  }

  public cboEndDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listSupport();
      }, 100);
    }
  }

  public cboSupportStatusSelectedIndexChanged(selectedValue: any): void {
    this.cboSupportStatusSelectedValue = selectedValue;
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listSupport();
      }, 100);
    }
  }
  
  public listSupport(): void {
    this.listSupportObservableArray = new ObservableArray();
    this.listSupportCollectionView = new CollectionView(this.listSupportObservableArray);
    this.listSupportCollectionView.pageSize = 15;
    this.listSupportCollectionView.trackChanges = true;
    this.listSupportCollectionView.refresh();
    this.listSupportFlexGrid.refresh();

    let startDate = [this.supportStartDateFilterData.getFullYear(), this.supportStartDateFilterData.getMonth() + 1, this.supportStartDateFilterData.getDate()].join('-');
    let endDate = [this.supportEndDateFilterData.getFullYear(), this.supportEndDateFilterData.getMonth() + 1, this.supportEndDateFilterData.getDate()].join('-');

    this.isProgressBarHidden = false;

    this.supportReportService.listSupport(startDate, endDate, this.cboSupportStatusSelectedValue);
    this.listSupportSub = this.supportReportService.listSupportObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSupportObservableArray = data;
          this.listSupportCollectionView = new CollectionView(this.listSupportObservableArray);
          this.listSupportCollectionView.pageSize = this.listActivityPageIndex;
          this.listSupportCollectionView.trackChanges = true;
          this.listSupportCollectionView.refresh();
          this.listSupportFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listSupportSub != null) this.listSupportSub.unsubscribe();
      }
    );
  }

  public btnCSVReportClick(): void {
    var fileName = "";

    fileName = "report-support.csv";

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

    data = 'Support Summary Report' + '\r\n\n';
    collection = this.listSupportCollectionView;
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

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.createCboSupportStatus();
  }

}
