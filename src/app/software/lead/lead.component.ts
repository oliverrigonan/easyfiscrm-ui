import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

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
    for (let i = 0; i <= 2; i++) {
      let status = "Open";

      switch (i) {
        case 0: {
          status = "Open";
          break;
        }
        case 1: {
          status = "For Closing";
          break;
        }
        case 2: {
          status = "Close";
          break;
        }
        default: {
          break;
        }
      }

      this.cboLeadStatusObservableArray.push({
        Status: status
      });
    }
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

  public btnAddLeadClick() {
    let btnAddLead: Element = document.getElementById("btnAddLead");
    (<HTMLButtonElement>btnAddLead).disabled = true;

    this.leadService.addLead();
    this.addLeadSub = this.leadService.addLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully added.", "Success");
          this.router.navigate(['/software/trn/lead/detail/', data[1]]);
        } else if (data[0] == "failed") {
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
    this.leadDeleteModalRef = this.modalService.show(leadDeleteModalTemplate, { class: "modal-sm" });
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
          this.toastr.success("Lead was successfully deleted.", "Success");

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

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.createCboLeadStatus();

    setTimeout(() => {
      this.listLead();
    }, 100);
  }

  ngOnDestroy() {
    if (this.listLeadSub != null) this.listLeadSub.unsubscribe();
    if (this.addLeadSub != null) this.addLeadSub.unsubscribe();
    if (this.deleteLeadSub != null) this.deleteLeadSub.unsubscribe();
  }
}