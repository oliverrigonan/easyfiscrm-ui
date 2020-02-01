import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { StatusService } from './status.service';
import { StatusModel } from './status.model';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private statusService: StatusService
  ) { }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.listStatusData();
  }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public cboSysFormObservable: ObservableArray = new ObservableArray();

  public listStatusObservableArray: ObservableArray = new ObservableArray();
  public listStatusCollectionView: CollectionView = new CollectionView(this.listStatusObservableArray);
  public listStatusPageIndex: number = 15;
  @ViewChild('listStatusFlexGrid') listStatusFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public listStatusSub: any;
  public addStatusSub: any;
  public updateStatusSub: any;
  public deleteStatusSub: any;


  public cboCategoryObservableArray: ObservableArray = new ObservableArray();
  public listCategorySub: any;

  public statusDetailModalRef: BsModalRef;
  public statusDeleteModalRef: BsModalRef;

  public isAddClick: boolean = false;
  public statusModalTitle: string = "Status";
  public statusDeleteModalTitle: string = "Status";


  public statusModel: StatusModel = {
    Id: 0,
    Status: "",
    Category: "",
    CreatedById: 0,
    CreatedDateTime: new Date(),
    UpdatedById: 0,
    UpdatedDateTime: new Date()
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
    this.listStatusPageIndex = selectedValue;

    this.listStatusCollectionView.pageSize = this.listStatusPageIndex;
    this.listStatusCollectionView.refresh();
    this.listStatusCollectionView.refresh();
  }

  public listStatusData(): void {
    this.listStatusObservableArray = new ObservableArray();
    this.listStatusCollectionView = new CollectionView(this.listStatusObservableArray);
    this.listStatusCollectionView.pageSize = 15;
    this.listStatusCollectionView.trackChanges = true;
    this.listStatusCollectionView.refresh();
    this.listStatusFlexGrid.refresh();

    this.isProgressBarHidden = false;

    this.statusService.listStatus();
    this.listStatusSub = this.statusService.listStatusObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listStatusObservableArray = data;
          this.listStatusCollectionView = new CollectionView(this.listStatusObservableArray);
          this.listStatusCollectionView.pageSize = this.listStatusPageIndex;
          this.listStatusCollectionView.trackChanges = true;
          this.listStatusCollectionView.refresh();
          this.listStatusFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listStatusSub != null) this.listStatusSub.unsubscribe();
      }
    );
  }

  public createCboCategory(): void {
    this.statusService.listCategory();
    this.listCategorySub = this.statusService.listCategoryObservable.subscribe(
      data => {
        let categoryObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            categoryObservableArray.push({
              Id: data[i].Id,
              Code: data[i].Code,
              Name: data[i].Name
            });
          }
        }
        this.cboCategoryObservableArray = categoryObservableArray;
        if (this.listCategorySub != null) this.listCategorySub.unsubscribe();
      }
    );
  }

  public btnSaveStatusClick(): void {
    if (this.isAddClick == true) {
      if (this.statusModel.Status !== "") {
        this.statusService.AddStatus(this.statusModel);
        this.addStatusSub = this.statusService.addStatusObservable.subscribe(
          data => {
            if (data[0] == "success") {
              this.statusDetailModalRef.hide();
              this.resetStatusModel();
              setTimeout(() => {
                this.toastr.success("Status successfully added.", "Success");
                this.isDataLoaded = false;
                this.listStatusData();
              }, 100);

            } else if (data[0] == "failed") {
              this.toastr.error(data[1], "Error");
            }
            if (this.addStatusSub != null) this.addStatusSub.unsubscribe();
          }
        );
      } else {
        this.toastr.error("Please don't leave empty fields.", "Error");
      }
    } else {
      if (this.statusModel.Status !== "") {
        this.statusService.UpdateStatus(this.statusModel);

        this.updateStatusSub = this.statusService.updateStatusObservable.subscribe(
          data => {
            if (data[0] == "success") {
              this.statusDetailModalRef.hide();
              this.resetStatusModel();
              setTimeout(() => {
                this.toastr.success("Updated successfully.", "Success");
                this.isDataLoaded = false;
                this.listStatusData();
              }, 100);

            } else if (data[0] == "failed") {
              this.toastr.error(data[1], "Error");
            }
            if (this.updateStatusSub != null) this.updateStatusSub.unsubscribe();
          }
        );
      } else {
        this.toastr.error("Please don't leave empty fields.", "Error");
      }
    }
  }

  public btnConfirmDeleteClick(): void {
    let currentStatus = this.listStatusCollectionView.currentItem;
    this.statusService.deleteStatus(currentStatus.Id);

    this.deleteStatusSub = this.statusService.deleteStatusObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.statusDeleteModalRef.hide();
          this.toastr.success("Deleted successfully.", "Success");
          setTimeout(() => {
            this.isDataLoaded = false;
            this.listStatusData();
          }, 100);

        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
        }
        if (this.deleteStatusSub != null) this.deleteStatusSub.unsubscribe();
      }
    );
  }

  public btnAddStatusClick(addProductDetailModalTemplate: TemplateRef<any>): void {
    this.statusDetailModalRef = this.modalService.show(addProductDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-md"
    });
    this.isAddClick = true;
    this.createCboCategory();
  }

  public btnEditStatusClick(editStatusDetailModalTemplate: TemplateRef<any>): void {
    this.statusDetailModalRef = this.modalService.show(editStatusDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-md"
    });
    this.isAddClick = false;
    this.createCboCategory();

    let currentStatus = this.listStatusCollectionView.currentItem;
    setTimeout(() => {
      this.statusModel.Id = currentStatus.Id;
      this.statusModel.Status = currentStatus.Status;
      this.statusModel.Category = currentStatus.Category;
      this.statusModel.CreatedById = currentStatus.CreatedByUserId;
      this.statusModel.CreatedDateTime = currentStatus.CreatedDateTime;
      this.statusModel.UpdatedById = currentStatus.UpdatedByUserId;
      this.statusModel.UpdatedDateTime = currentStatus.UpdatedDateTime;
    }, 100);

  }

  public btnDeleteProductClick(deleltestatusDetailModalTemplate: TemplateRef<any>): void {
    this.statusDeleteModalRef = this.modalService.show(deleltestatusDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
    this.isAddClick = true;
  }

  public btnCloseModal(): void {
    this.statusDetailModalRef.hide();
    this.resetStatusModel();
  }

  public resetStatusModel(): void {
    this.statusModel.Id = 0;
    this.statusModel.Status = "";
    this.statusModel.Category = "";
    this.statusModel.CreatedById = 0;
    this.statusModel.CreatedDateTime = new Date();
    this.statusModel.UpdatedById = 0;
    this.statusModel.UpdatedDateTime = new Date();
  }

  ngOnDestroy() {
    if (this.listStatusSub != null) this.listStatusSub.unsubscribe();
    if (this.listCategorySub != null) this.listCategorySub.unsubscribe();
    if (this.addStatusSub != null) this.addStatusSub.unsubscribe();
    if (this.updateStatusSub != null) this.updateStatusSub.unsubscribe();
    if (this.deleteStatusSub != null) this.deleteStatusSub.unsubscribe();
  }
}
