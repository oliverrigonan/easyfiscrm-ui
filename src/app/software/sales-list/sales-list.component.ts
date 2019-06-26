import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { SalesListService } from './sales-list.service';
import { SalesListModel } from './sales-list.model';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {

  constructor(
    private salesListService: SalesListService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  public salesListModel: SalesListModel = {
    Id: 0,
    BranchId: 0,
    SINumber: 0,
    SIDate: new Date(),
    CustomerId: 0,
    TermId: 0,
    DocumentReference: '',
    ManualSINumber: '',
    Remarks: '',
    Amount: 0,
    PaidAmount: 0,
    AdjustmentAmount: 0,
    BalanceAmount: 0,
    SoldById: 0,
    PreparedById: 0,
    CheckedById: 0,
    ApprovedById: 0,
    Status: '',
    IsCancelled: false,
    IsPrinted: false
  }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public listSalesObservableArray: ObservableArray = new ObservableArray();
  public listSalesCollectionView: CollectionView = new CollectionView(this.listSalesObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listSalesFlexGrid') listSalesFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public listSalesSub: any;

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
  public listSales(): void {
    if (!this.isDataLoaded) {
      setTimeout(() => {
        this.listSalesObservableArray = new ObservableArray();
        this.listSalesCollectionView = new CollectionView(this.listSalesObservableArray);
        this.listSalesCollectionView.pageSize = 15;
        this.listSalesCollectionView.trackChanges = true;
        this.listSalesCollectionView.refresh();
        this.listSalesFlexGrid.refresh();

        this.isProgressBarHidden = false;

        this.salesListService.listSales();
        this.listSalesSub = this.salesListService.listSalesObservable.subscribe(
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

            if (this.listSalesSub != null) this.listSalesSub.unsubscribe();
          }
        );
      }, 100);
    }
  }


  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.listSales();
  }

}
