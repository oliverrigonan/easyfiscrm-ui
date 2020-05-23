import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ToastrService } from 'ngx-toastr';

import { LeadService } from './lead.service';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent implements OnInit {

  constructor(
    private leadService: LeadService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.createCboLeadStatus();
    this.getFirsDayOftheMonth();
  }

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
  public addLeadSub: any;
  public deleteLeadSub: any;

  public leadDeleteModalRef: BsModalRef;

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

  public getFirsDayOftheMonth() {
    var date = new Date();
    this.leadStartDateFilterData = new Date(date.getFullYear(), date.getMonth(), 1);
    this.leadEndDateFilterData = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
    this.leadService.listStatus();
    this.cboListStatusSub = this.leadService.listStatusObservable.subscribe(
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
    let isDashboard: boolean = false;
    let userId;
    let startDate;
    let endDate;

    this.activatedRoute.params.subscribe(params => { isDashboard = params["dashboard"]; });

    if (isDashboard) {
      this.activatedRoute.params.subscribe(params => { startDate = params["startDate"]; });
      this.activatedRoute.params.subscribe(params => { endDate = params["endDate"]; });
      this.activatedRoute.params.subscribe(params => { this.cboLeadStatusSelectedValue = params["status"]; });
      this.activatedRoute.params.subscribe(params => { userId = params["userId"]; });
      this.leadStartDateFilterData = startDate;
      this.leadEndDateFilterData = endDate;

      this.listLeadObservableArray = new ObservableArray();
      this.listLeadCollectionView = new CollectionView(this.listLeadObservableArray);
      this.listLeadCollectionView.pageSize = 15;
      this.listLeadCollectionView.trackChanges = true;
      this.listLeadCollectionView.refresh();
      this.listLeadFlexGrid.refresh();

      this.isProgressBarHidden = false;

      this.leadService.listLeadFilteredByUser(startDate, endDate, this.cboLeadStatusSelectedValue, userId);
      this.listLeadSub = this.leadService.listLeadObservable.subscribe(
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
    else {
      startDate = [this.leadStartDateFilterData.getFullYear(), this.leadStartDateFilterData.getMonth() + 1, this.leadStartDateFilterData.getDate()].join('-');
      endDate = [this.leadEndDateFilterData.getFullYear(), this.leadEndDateFilterData.getMonth() + 1, this.leadEndDateFilterData.getDate()].join('-');

      this.listLeadObservableArray = new ObservableArray();
      this.listLeadCollectionView = new CollectionView(this.listLeadObservableArray);
      this.listLeadCollectionView.pageSize = 15;
      this.listLeadCollectionView.trackChanges = true;
      this.listLeadCollectionView.refresh();
      this.listLeadFlexGrid.refresh();

      this.isProgressBarHidden = false;

      this.leadService.listLead(startDate, endDate, this.cboLeadStatusSelectedValue);
      this.listLeadSub = this.leadService.listLeadObservable.subscribe(
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
  }

  public btnAddLeadClick() {

    let btnAddLead: Element = document.getElementById("btnAddLead");
    (<HTMLButtonElement>btnAddLead).disabled = true;

    this.leadService.addLead();

    this.addLeadSub = this.leadService.addLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully added.", "Success");
          (<HTMLButtonElement>btnAddLead).disabled = false;
          this.router.navigate(['/software/trn/lead/detail/', data[1]]);
        } 
        if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnAddLead).disabled = false;
        }

        if (this.addLeadSub != null) this.addLeadSub.unsubscribe();
      }
    );
  }

  public btnEditLeadClick() {
    let currentLead = this.listLeadCollectionView.currentItem;
    this.router.navigate(['/software/trn/lead/detail/', currentLead.Id]);
  }

  public btnDeleteLeadClick(leadDeleteModalTemplate: TemplateRef<any>): void {
    this.leadDeleteModalRef = this.modalService.show(leadDeleteModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
  }

  public btnConfirmDeleteLeadClick() {
    let btnConfirmDeleteLead: Element = document.getElementById("btnConfirmDeleteLead");
    let btnCloseConfirmDeleteLeadModal: Element = document.getElementById("btnCloseConfirmDeleteLeadModal");
    (<HTMLButtonElement>btnConfirmDeleteLead).disabled = true;
    (<HTMLButtonElement>btnCloseConfirmDeleteLeadModal).disabled = true;

    let currentLead = this.listLeadCollectionView.currentItem;
    this.leadService.deleteLead(currentLead.Id);
    this.deleteLeadSub = this.leadService.deleteLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully deleted.", "Success");
          setTimeout(() => {
            this.listLead();
            this.leadDeleteModalRef.hide();
          }, 100);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnConfirmDeleteLead).disabled = false;
          (<HTMLButtonElement>btnCloseConfirmDeleteLeadModal).disabled = false;
        }

        if (this.deleteLeadSub != null) this.deleteLeadSub.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.listLeadSub != null) this.listLeadSub.unsubscribe();
    if (this.addLeadSub != null) this.addLeadSub.unsubscribe();
    if (this.deleteLeadSub != null) this.deleteLeadSub.unsubscribe();
  }
}
