import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { SalesListService } from './sales-list.service';
import { SalesDeliveryListModel } from './sales-list.model';

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

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.createCboSalesStatus();
    this.getFirsDayOftheMonth();
    this.listSales();
  }

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
  public listSalesSub: any;
  public addSalesSub: any;
  public deleteSalesDeliverySub: any;

  public deleteSalesDeliveryModalRef: BsModalRef;

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

  public createCboSalesStatus(): void {
    this.salesListService.listStatus();
    this.cboListStatusSub = this.salesListService.listStatusObservable.subscribe(
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

  public getFirsDayOftheMonth() {
    var date = new Date();
    this.salesStartDateFilterData = new Date(date.getFullYear(), date.getMonth(), 1);
    this.salesEndDateFilterData = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

    let isDashboard: boolean = false;
    let userId;
    let startDate;
    let endDate;

    this.activatedRoute.params.subscribe(params => { isDashboard = params["dashboard"]; });

    if (isDashboard) {
      this.activatedRoute.params.subscribe(params => { startDate = params["startDate"]; });
      this.activatedRoute.params.subscribe(params => { endDate = params["endDate"]; });
      this.activatedRoute.params.subscribe(params => { this.cboSalesStatusSelectedValue = params["status"]; });
      this.activatedRoute.params.subscribe(params => { userId = params["userId"]; });
      this.salesStartDateFilterData = startDate;
      this.salesEndDateFilterData = endDate;

      this.listSalesObservableArray = new ObservableArray();
      this.listSalesCollectionView = new CollectionView(this.listSalesObservableArray);
      this.listSalesCollectionView.pageSize = 15;
      this.listSalesCollectionView.trackChanges = true;
      this.listSalesCollectionView.refresh();
      this.listSalesFlexGrid.refresh();

      this.isProgressBarHidden = false;

      this.salesListService.listSalesFilteredByUser(startDate, endDate, this.cboSalesStatusSelectedValue, userId);
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
    }
    else {
      startDate = [this.salesStartDateFilterData.getFullYear(), this.salesStartDateFilterData.getMonth() + 1, this.salesStartDateFilterData.getDate()].join('-');
      endDate = [this.salesEndDateFilterData.getFullYear(), this.salesEndDateFilterData.getMonth() + 1, this.salesEndDateFilterData.getDate()].join('-');

      this.listSalesObservableArray = new ObservableArray();
      this.listSalesCollectionView = new CollectionView(this.listSalesObservableArray);
      this.listSalesCollectionView.pageSize = 15;
      this.listSalesCollectionView.trackChanges = true;
      this.listSalesCollectionView.refresh();
      this.listSalesFlexGrid.refresh();

      this.isProgressBarHidden = false;

      this.salesListService.listSales(startDate, endDate, this.cboSalesStatusSelectedValue);
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
    }

  }

  public btnAddSalesClick() {
    let btnAddSales: Element = document.getElementById("btnAddSales");
    (<HTMLButtonElement>btnAddSales).disabled = true;

    this.salesListService.AddSales();
    this.addSalesSub = this.salesListService.addSalesObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully added.", "Success");
          this.router.navigate(['/software/trn/sales/detail/', data[1]]);
        }
        else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnAddSales).disabled = false;
        }
        if (this.addSalesSub != null) this.addSalesSub.unsubscribe();
      }
    );
  }



  public btnDeleteSalesDeliveryClick(salesDeliveryDeleteModalTemplate: TemplateRef<any>): void {
    this.deleteSalesDeliveryModalRef = this.modalService.show(salesDeliveryDeleteModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });

  }

  public btnConfirmDeleteSalesDeliveryClick(): void {
    let btnConfirmDeleteSalesDelivery: Element = document.getElementById("btnConfirmDeleteSalesDelivery");
    let btnCloseConfirmDeleteAcitivityModal: Element = document.getElementById("btnCloseConfirmDeleteSalesDeliveryModal");
    (<HTMLButtonElement>btnConfirmDeleteSalesDelivery).disabled = true;
    (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = true;

    let currentItem = this.listSalesCollectionView.currentItem;
    this.salesListService.DeleteSalesDelivery(currentItem.Id);
    this.deleteSalesDeliverySub = this.salesListService.deleteSalesDeliveryObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully deleted!", "Success");
          setTimeout(() => {
            this.listSales();
            this.deleteSalesDeliveryModalRef.hide();
          }, 100);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnConfirmDeleteSalesDelivery).disabled = false;
          (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = false;
        }
        if (this.deleteSalesDeliverySub != null) this.deleteSalesDeliverySub.unsubscribe();
      }
    );
  }

  public btnEditSalesClick(): void {
    let currentSales = this.listSalesCollectionView.currentItem;
    this.router.navigate(['/software/trn/sales/detail/', currentSales.Id]);
  }

  ngOnDestroy() {
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.listSalesSub != null) this.listSalesSub.unsubscribe();
    if (this.addSalesSub != null) this.addSalesSub.unsubscribe();
    if (this.deleteSalesDeliverySub != null) this.deleteSalesDeliverySub.unsubscribe();
  }

}
