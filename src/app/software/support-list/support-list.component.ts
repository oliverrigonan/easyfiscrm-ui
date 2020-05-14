import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SupportListService } from './support-list.service';

@Component({
  selector: 'app-support-list',
  templateUrl: './support-list.component.html',
  styleUrls: ['./support-list.component.css']
})
export class SupportListComponent implements OnInit {

  constructor(
    private supportListService: SupportListService,
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
  public listSupportPageIndex: number = 15;
  @ViewChild('listSupportFlexGrid') listSupportFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public cboListStatusSub: any;
  public listSupportSub: any;
  public addSupportSub: any;
  public deleteSupportSub: any;

  public deleteSupportModalRef: BsModalRef;

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.createCboSupportStatus();
    this.getFirsDayOftheMonth();
  }

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
    this.listSupportPageIndex = selectedValue;

    this.listSupportCollectionView.pageSize = this.listSupportPageIndex;
    this.listSupportCollectionView.refresh();
    this.listSupportCollectionView.refresh();
  }

  public createCboSupportStatus(): void {
    this.supportListService.listStatus();
    this.cboListStatusSub = this.supportListService.listStatusObservable.subscribe(
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

  public getFirsDayOftheMonth() {
    var date = new Date();
    this.supportStartDateFilterData = new Date(date.getFullYear(), date.getMonth(), 1);
    this.supportEndDateFilterData = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
    let isDashboard: boolean = false;
    let userId;
    let startDate;
    let endDate;

    this.activatedRoute.params.subscribe(params => { isDashboard = params["dashboard"]; });

    if (isDashboard) {
      this.activatedRoute.params.subscribe(params => { startDate = params["startDate"]; });
      this.activatedRoute.params.subscribe(params => { endDate = params["endDate"]; });
      this.activatedRoute.params.subscribe(params => { this.cboSupportStatusSelectedValue = params["status"]; });
      this.activatedRoute.params.subscribe(params => { userId = params["userId"]; });
      this.supportStartDateFilterData = startDate;
      this.supportEndDateFilterData = endDate;

      this.listSupportObservableArray = new ObservableArray();
      this.listSupportCollectionView = new CollectionView(this.listSupportObservableArray);
      this.listSupportCollectionView.pageSize = 15;
      this.listSupportCollectionView.trackChanges = true;
      this.listSupportCollectionView.refresh();
      this.listSupportFlexGrid.refresh();

      this.isProgressBarHidden = false;

      this.supportListService.listSupportFilteredByUser(startDate, endDate, this.cboSupportStatusSelectedValue, userId);
      this.listSupportSub = this.supportListService.listSupportObservable.subscribe(
        data => {
          if (data.length > 0) {
            this.listSupportObservableArray = data;
            this.listSupportCollectionView = new CollectionView(this.listSupportObservableArray);
            this.listSupportCollectionView.pageSize = this.listSupportPageIndex;
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
    else {
      startDate = [this.supportStartDateFilterData.getFullYear(), this.supportStartDateFilterData.getMonth() + 1, this.supportStartDateFilterData.getDate()].join('-');
      endDate = [this.supportEndDateFilterData.getFullYear(), this.supportEndDateFilterData.getMonth() + 1, this.supportEndDateFilterData.getDate()].join('-');

      this.listSupportObservableArray = new ObservableArray();
      this.listSupportCollectionView = new CollectionView(this.listSupportObservableArray);
      this.listSupportCollectionView.pageSize = 15;
      this.listSupportCollectionView.trackChanges = true;
      this.listSupportCollectionView.refresh();
      this.listSupportFlexGrid.refresh();

      this.isProgressBarHidden = false;

      this.supportListService.listSupport(startDate, endDate, this.cboSupportStatusSelectedValue);
      this.listSupportSub = this.supportListService.listSupportObservable.subscribe(
        data => {
          if (data.length > 0) {
            this.listSupportObservableArray = data;
            this.listSupportCollectionView = new CollectionView(this.listSupportObservableArray);
            this.listSupportCollectionView.pageSize = this.listSupportPageIndex;
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


  }

  public btnAddSupportClick(): void {
    let btnAddSupport: Element = document.getElementById("btnAddSupport");
    (<HTMLButtonElement>btnAddSupport).disabled = true;

    this.supportListService.AddSupport();
    this.addSupportSub = this.supportListService.addSupportObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully added!", "Success");
          this.router.navigate(['/software/trn/support/detail/', data[1]]);
        }
        else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnAddSupport).disabled = false;
        }
        if (this.addSupportSub != null) this.addSupportSub.unsubscribe();
      }
    );
  }

  public btnDeleteSupportClick(supportDeleteModalTemplate: TemplateRef<any>): void {
    this.deleteSupportModalRef = this.modalService.show(supportDeleteModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
  }

  public btnConfirmDeleteSupportClick(): void {
    let btnConfirmDeleteSupport: Element = document.getElementById("btnConfirmDeleteSupport");
    let btnCloseConfirmDeleteAcitivityModal: Element = document.getElementById("btnCloseConfirmDeleteSupportModal");
    (<HTMLButtonElement>btnConfirmDeleteSupport).disabled = true;
    (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = true;

    let currentItem = this.listSupportCollectionView.currentItem;
    this.supportListService.DeleteSupport(currentItem.Id);
    this.deleteSupportSub = this.supportListService.deleteSupportObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully deleted!", "Success");
          setTimeout(() => {
            this.listSupport();
            this.deleteSupportModalRef.hide();
          }, 100);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnConfirmDeleteSupport).disabled = false;
          (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = false;
        }
        if (this.deleteSupportSub != null) this.deleteSupportSub.unsubscribe();
      }
    );
  }

  public btnEditSupportClick(): void {
    let currentSupport = this.listSupportCollectionView.currentItem;
    this.router.navigate(['/software/trn/support/detail/', currentSupport.Id]);
  }

  ngOnDestroy() {
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.listSupportSub != null) this.listSupportSub.unsubscribe();
    if (this.deleteSupportSub != null) this.deleteSupportSub.unsubscribe();
  }
}
