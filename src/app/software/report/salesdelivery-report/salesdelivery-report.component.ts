import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SalesdeliveryReportService } from './salesdelivery-report.service';

@Component({
  selector: 'app-salesdelivery-report',
  templateUrl: './salesdelivery-report.component.html',
  styleUrls: ['./salesdelivery-report.component.css']
})
export class SalesdeliveryReportComponent implements OnInit {

  constructor(
    private salesDeliveryReportService: SalesdeliveryReportService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public salesStartDateFilterData = new Date();
  public salesEndDateFilterData = new Date();

  public cboSalesStatusObservableArray: ObservableArray = new ObservableArray();
  public cboSalesStatusSelectedValue: string = "Open";

  public listSalesObservableArray: ObservableArray = new ObservableArray();
  public listSalesCollectionView: CollectionView = new CollectionView(this.listSalesObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listSalesFlexGrid') listSalesFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public cboListStatusSub: any;
  public listSalesDeliverySub: any;

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

    this.listSalesCollectionView.pageSize = this.listActivityPageIndex;
    this.listSalesCollectionView.refresh();
    this.listSalesCollectionView.refresh();
  }

  public createCboSalesDeliveryStatus(): void {
    this.salesDeliveryReportService.listStatus();
    this.cboListStatusSub = this.salesDeliveryReportService.listStatusObservable.subscribe(
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

        this.cboSalesStatusObservableArray = statusObservableArray;
        if (this.cboSalesStatusObservableArray.length > 0) {
          setTimeout(() => {
            this.listSales();
          }, 100);
        }

        if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
      }
    );
  }

  public cboStartDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listSales();
      }, 100);
    }
  }

  public cboEndDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listSales();
      }, 100);
    }
  }

  public cboSalesStatusSelectedIndexChanged(selectedValue: any): void {
    this.cboSalesStatusSelectedValue = selectedValue;

    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listSales();
      }, 100);
    }
  }

  public listSales(): void {
    this.listSalesObservableArray = new ObservableArray();
    this.listSalesCollectionView = new CollectionView(this.listSalesObservableArray);
    this.listSalesCollectionView.pageSize = 15;
    this.listSalesCollectionView.trackChanges = true;
    this.listSalesCollectionView.refresh();
    this.listSalesFlexGrid.refresh();

    let startDate = [this.salesStartDateFilterData.getFullYear(), this.salesStartDateFilterData.getMonth() + 1, this.salesStartDateFilterData.getDate()].join('-');
    let endDate = [this.salesEndDateFilterData.getFullYear(), this.salesEndDateFilterData.getMonth() + 1, this.salesEndDateFilterData.getDate()].join('-');

    this.isProgressBarHidden = false;

    this.salesDeliveryReportService.listSalesDelivery(startDate, endDate, this.cboSalesStatusSelectedValue);
    this.listSalesDeliverySub = this.salesDeliveryReportService.listSalesObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listSalesObservableArray = data;
          this.listSalesCollectionView = new CollectionView(this.listSalesObservableArray);
          this.listSalesCollectionView.pageSize = this.listActivityPageIndex;
          this.listSalesCollectionView.trackChanges = true;
          this.listSalesCollectionView.refresh();
          this.listSalesFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listSalesDeliverySub != null) this.listSalesDeliverySub.unsubscribe();
      }
    );
  }

  public btnCSVReportClick(): void {
    var fileName = "";

    fileName = "report-sales-delivery.csv";

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

    data = 'Sales Delivery Summary Report' + '\r\n\n';
    collection = this.listSalesCollectionView;
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
    this.createCboSalesDeliveryStatus();
    this.listSales();
  }

  ngOnDestroy() {
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.listSalesDeliverySub != null) this.listSalesDeliverySub.unsubscribe();
  }
}
