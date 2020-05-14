import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SupportDetailService } from './support-detail.service';
import { SupportModel } from '../support-list/support-list.model';
import { SupportDetailActivityModel } from './support-detail-activity.model';
import { SupportDetailPrintDialogComponent } from './support-detail-print-dialog/support-detail-print-dialog.component';
import { SupportDetailActivityPrintDialogComponent } from './support-detail-activity-print-dialog/support-detail-activity-print-dialog.component';

@Component({
  selector: 'app-support-detail',
  templateUrl: './support-detail.component.html',
  styleUrls: ['./support-detail.component.css']
})
export class SupportDetailComponent implements OnInit {

  constructor(
    private supportDetailService: SupportDetailService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    public casePrintCaseDialog: MatDialog
  ) { }

  public IsLoaded: Boolean = false;
  public listCustomerObservableArray: ObservableArray = new ObservableArray();
  public listCustomerCollectionView: CollectionView = new CollectionView(this.listCustomerObservableArray);
  public listCustomerPageIndex: number = 15;
  @ViewChild('listCustomerFlexGrid') listCustomerFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public selectedCustomer: string = "";

  public detailSupportSub: any;

  public customerModalRef: BsModalRef;

  public cboCustomerSub: any;
  public cboCustomerObservableArray: ObservableArray = new ObservableArray();
  public pickCutomerButtonClick: boolean = false;

  public cboAssignedToUserSub: any;
  public cboAssignedToUserObservable: ObservableArray = new ObservableArray();

  public cboSupportStatusSub: any;
  public cboSupportStatusObservable: ObservableArray = new ObservableArray();

  public cboSalesDeliverySub: any;
  public cboSalesDeliveryObservable: ObservableArray = new ObservableArray();
  @ViewChild('cboSalesInvoice') cboSalesInvoice: WjComboBox;

  public saveSupportSub: any;
  public lockSupportSub: any;
  public unlockSupportSub: any;

  public isLocked: Boolean = false;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public listActivityObservableArray: ObservableArray = new ObservableArray();
  public listActivityCollectionView: CollectionView = new CollectionView(this.listActivityObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listActivityFlexGrid') listActivityFlexGrid: WjFlexGrid;
  public isDataLoaded: boolean = false;

  public listActivitySub: any;
  public saveActivitySub: any;
  public deleteActivitySub: any;

  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;
  public isActivityTabHidden: boolean = true;

  public activityModalHeaderTitle: string = "Activity";

  public cboListActivityUsersSub: any;
  public cboListActivityUsersObservableArray: ObservableArray = new ObservableArray();

  public cboListActivityStatusSub: any;
  public cboListActivityStatusObservableArray: ObservableArray = new ObservableArray();

  public isActivityLoadingSpinnerHidden: boolean = false;
  public isActivityContentHidden: boolean = true;
  public isActivityNumberHidden = false;

  public activitiyModalRef: BsModalRef;
  public deleteActivitiyModalRef: BsModalRef;

  public isAddClicked: boolean = false;
  public isSalesDeliveryDataLoaded: boolean = false;

  public supportModel: SupportModel = {
    Id: 0,
    SPNumber: "",
    SPDate: new Date(),
    CustomerId: 0,
    Customer: "",
    SDId: 0,
    SDNumber: "",
    ContactPerson: "",
    ContactPosition: "",
    ContactEmail: "",
    ContactPhoneNumber: "",
    Issue: "",
    AssignedToUserId: 0,
    AssignedToUser: "",
    Status: "",
    IsLocked: false,
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: new Date()
  }

  ngOnInit() {
    this.createCboAssignedToUser();
    this.createCboShowNumberOfRows();
  }

  public listCustomer(): void {
    this.listCustomerObservableArray = new ObservableArray();
    this.listCustomerCollectionView = new CollectionView(this.listCustomerObservableArray);
    this.listCustomerCollectionView.pageSize = 15;
    this.listCustomerCollectionView.trackChanges = true;
    this.listCustomerCollectionView.refresh();
    // this.listCustomerFlexGrid.refresh();

    this.isProgressBarHidden = false;
    this.supportDetailService.listCustomer();
    this.cboCustomerSub = this.supportDetailService.listCustomerObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listCustomerObservableArray = data;
          this.listCustomerCollectionView = new CollectionView(this.listCustomerObservableArray);
          this.listCustomerCollectionView.pageSize = this.listCustomerPageIndex;
          this.listCustomerCollectionView.trackChanges = true;
          this.listCustomerCollectionView.refresh();
          // this.listCustomerFlexGrid.refresh();
        }
        this.isProgressBarHidden = true;
        if (this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
      }
    );
  }

  public btnCustomerListClick(customerModalTemplate: TemplateRef<any>): void {
    this.activityModalHeaderTitle = "Costumer List";
    this.listCustomer();
    setTimeout(() => {
      this.customerModalRef = this.modalService.show(customerModalTemplate, {
        backdrop: true,
        ignoreBackdropClick: true,
        class: "modal-lg"
      });
    }, 100);
  }

  public btnPickCustomerClick(): void {
    let currentCustomer = this.listCustomerCollectionView.currentItem;
    this.selectedCustomer = currentCustomer.Article;
    this.supportModel.CustomerId = currentCustomer.Id;

    this.customerModalRef.hide();
    this.pickCutomerButtonClick = true;
    this.getCboSalesDeliveryDetail(this.supportModel.CustomerId);
  }

  public getCboSalesDeliveryDetail(customerId: number): void {
    this.supportDetailService.listSalesDelivery(customerId);
    this.cboSalesDeliverySub = this.supportDetailService.listSalesDeliveryObservable.subscribe(
      data => {
        let salesInvoiceObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            salesInvoiceObservableArray.push({
              Id: data[i].Id,
              SDNumber: data[i].SDNumber,
              ContactPerson: data[i].ContactPerson,
              ContactPosition: data[i].ContactPosition,
              ContactEmail: data[i].ContactEmail,
              ContactPhoneNumber: data[i].ContactPhoneNumber
            });
          }
        } else {
          this.toastr.error("No sales delivery!");

          salesInvoiceObservableArray.push({
            Id: 0,
            SDNumber: "",
            ContactPerson: "NA",
            ContactPosition: "NA",
            ContactEmail: "NA",
            ContactPhoneNumber: "NA"
          });
        }
        if (salesInvoiceObservableArray != null) {
          this.cboSalesDeliveryObservable = salesInvoiceObservableArray;
        }
        if (this.cboSalesDeliverySub != null) this.cboSalesDeliverySub.unsubscribe();
      }
    );
  }

  public cboSalesInvoice_SelectedIndexChange(cboSalesInvoice: any): void {
    if (this.pickCutomerButtonClick) {
      this.supportModel.ContactPerson = this.cboSalesInvoice.selectedItem["ContactPerson"];
      this.supportModel.ContactPosition = this.cboSalesInvoice.selectedItem["ContactPosition"];
      this.supportModel.ContactEmail = this.cboSalesInvoice.selectedItem["ContactEmail"];
      this.supportModel.ContactPhoneNumber = this.cboSalesInvoice.selectedItem["ContactPhoneNumber"];
    }
  }

  public createCboAssignedToUser(): void {
    this.supportDetailService.listAssignedUsers();
    this.cboAssignedToUserSub = this.supportDetailService.listLeadAssignedToUsersObservable.subscribe(
      data => {
        let assignedToUserObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            assignedToUserObservableArray.push({
              Id: data[i].Id,
              FullName: data[i].FullName
            });
          }
        }

        this.cboAssignedToUserObservable = assignedToUserObservableArray;
        setTimeout(() => {
          this.createCboStatus();
        }, 100);
        if (this.cboAssignedToUserSub != null) this.cboAssignedToUserSub.unsubscribe();
      }
    );
  }

  public createCboStatus(): void {
    this.supportDetailService.listSupportStatus();
    this.cboSupportStatusSub = this.supportDetailService.listSupportStatusObservable.subscribe(
      data => {
        let statusObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            statusObservableArray.push({
              Id: data[i].Id,
              Status: data[i].Status
            });
          }
        }

        this.cboSupportStatusObservable = statusObservableArray;
        setTimeout(() => {
          this.detailSupport();
        }, 100);
        if (this.cboSupportStatusSub != null) this.cboSupportStatusSub.unsubscribe();
      }
    );
  }

  public detailSupport(): void {
    let id: number = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.supportDetailService.detailSupport(id);
    this.detailSupportSub = this.supportDetailService.detailSupportObservable.subscribe(
      data => {
        this.getCboSalesDeliveryDetail(data.CustomerId);
        setTimeout(() => {
          this.loadSupportDetail(data);
        }, 100);

        let btnSaveSupport: Element = document.getElementById("btnSaveSupport");
        let btnLockSupport: Element = document.getElementById("btnLockSupport");
        let btnUnlockSupport: Element = document.getElementById("btnUnlockSupport");
        this.selectedCustomer = data.Customer;

        (<HTMLButtonElement>btnSaveSupport).disabled = false;
        (<HTMLButtonElement>btnLockSupport).disabled = false;
        (<HTMLButtonElement>btnUnlockSupport).disabled = true;

        if (data.IsLocked) {
          this.isLocked = true;
          (<HTMLButtonElement>btnSaveSupport).disabled = true;
          (<HTMLButtonElement>btnLockSupport).disabled = true;
          (<HTMLButtonElement>btnUnlockSupport).disabled = false;
          this.isActivityTabHidden = false;
        }
        this.isLoadingSpinnerHidden = true;
        this.isContentHidden = false;
        if (this.detailSupportSub != null) this.detailSupportSub.unsubscribe();
      }
    );
  }

  public loadSupportDetail(objSupport: any): void {
    this.supportModel.Id = objSupport.Id;
    this.supportModel.SPNumber = objSupport.SPNumber;
    this.supportModel.SPDate = objSupport.SPDate;
    this.supportModel.CustomerId = objSupport.CustomerId;
    this.supportModel.Customer = objSupport.Customer;
    this.supportModel.SDId = objSupport.SDId,
    this.supportModel.SDNumber = objSupport.SDNumber,
    this.supportModel.ContactPerson = objSupport.ContactPerson;
    this.supportModel.ContactPosition = objSupport.ContactPosition;
    this.supportModel.ContactEmail = objSupport.ContactEmail;
    this.supportModel.ContactPhoneNumber = objSupport.ContactPhoneNumber;
    this.supportModel.Issue = objSupport.Issue;
    this.supportModel.AssignedToUserId = objSupport.AssignedToUserId;
    this.supportModel.AssignedToUserId = objSupport.AssignedToUserId;
    this.supportModel.Status = objSupport.Status;
    this.supportModel.IsLocked = objSupport.IsLocked;
    this.supportModel.CreatedByUserId = objSupport.CreatedByUserId;
    this.supportModel.CreatedByUser = objSupport.CreatedByUser;
    this.supportModel.CreatedDateTime = objSupport.CreatedDateTime;
    this.supportModel.UpdatedByUserId = objSupport.UpdatedByUserId;
    this.supportModel.UpdatedByUser = objSupport.UpdatedByUser;
    this.supportModel.UpdatedDateTime = objSupport.UpdatedDateTime;
  }

  public btnSaveSupportClick(): void {
    let btnSaveSupport: Element = document.getElementById("btnSaveSupport");
    let btnLockSupport: Element = document.getElementById("btnLockSupport");
    let btnUnlockSupport: Element = document.getElementById("btnUnlockSupport");
    (<HTMLButtonElement>btnSaveSupport).disabled = true;
    (<HTMLButtonElement>btnLockSupport).disabled = true;
    (<HTMLButtonElement>btnUnlockSupport).disabled = true;

    this.supportDetailService.saveSupport(this.supportModel);
    this.saveSupportSub = this.supportDetailService.saveSupportObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully saved!", "Success");

          setTimeout(() => {
            (<HTMLButtonElement>btnSaveSupport).disabled = false;
            (<HTMLButtonElement>btnLockSupport).disabled = false;
            (<HTMLButtonElement>btnUnlockSupport).disabled = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveSupport).disabled = false;
          (<HTMLButtonElement>btnLockSupport).disabled = false;
          (<HTMLButtonElement>btnUnlockSupport).disabled = true;
        }
        if (this.saveSupportSub != null) this.saveSupportSub.unsubscribe();
      }
    );
  }

  public btnLockSupportClick(): void {
    let btnSaveSupport: Element = document.getElementById("btnSaveSupport");
    let btnLockSupport: Element = document.getElementById("btnLockSupport");
    let btnUnlockSupport: Element = document.getElementById("btnUnlockSupport");
    (<HTMLButtonElement>btnSaveSupport).disabled = true;
    (<HTMLButtonElement>btnLockSupport).disabled = true;
    (<HTMLButtonElement>btnUnlockSupport).disabled = true;

    this.supportDetailService.lockSupport(this.supportModel);
    this.lockSupportSub = this.supportDetailService.lockSupportObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully locked!", "Success");
          setTimeout(() => {
            this.isLocked = true;
            (<HTMLButtonElement>btnSaveSupport).disabled = true;
            (<HTMLButtonElement>btnLockSupport).disabled = true;
            (<HTMLButtonElement>btnUnlockSupport).disabled = false;
            this.isActivityTabHidden = false;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnSaveSupport).disabled = false;
          (<HTMLButtonElement>btnLockSupport).disabled = false;
          (<HTMLButtonElement>btnUnlockSupport).disabled = true;
        }

        if (this.lockSupportSub != null) this.lockSupportSub.unsubscribe();
      }
    );
  }

  public btnUnlockSupportClick(): void {
    let btnSaveSupport: Element = document.getElementById("btnSaveSupport");
    let btnLockSupport: Element = document.getElementById("btnLockSupport");
    let btnUnlockSupport: Element = document.getElementById("btnUnlockSupport");
    (<HTMLButtonElement>btnSaveSupport).disabled = true;
    (<HTMLButtonElement>btnLockSupport).disabled = true;
    (<HTMLButtonElement>btnUnlockSupport).disabled = true;
    this.isActivityTabHidden = true;

    this.supportDetailService.unlockSupport(this.supportModel);
    this.unlockSupportSub = this.supportDetailService.unlockSupportObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully unlocked!", "Success");

          setTimeout(() => {
            this.isLocked = false;

            (<HTMLButtonElement>btnSaveSupport).disabled = false;
            (<HTMLButtonElement>btnLockSupport).disabled = false;
            (<HTMLButtonElement>btnUnlockSupport).disabled = true;

            this.isActivityTabHidden = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveSupport).disabled = true;
          (<HTMLButtonElement>btnLockSupport).disabled = true;
          (<HTMLButtonElement>btnUnlockSupport).disabled = false;

          this.isActivityTabHidden = false;
        }

        if (this.unlockSupportSub != null) this.unlockSupportSub.unsubscribe();
      }
    );
  }

  public supportDetailActivityModel: SupportDetailActivityModel = {
    Id: 0,
    SPDate: new Date(),
    SPNumber: "",
    SPName: "",
    ACNumber: "",
    ACDate: new Date(),
    UserId: 0,
    User: "",
    FunctionalUserId: 0,
    FunctionalUser: "",
    TechnicalUserId: 0,
    TechnicalUser: "",
    CRMStatus: "",
    Activity: "",
    StartDate: new Date(),
    StartTime: new Date(),
    EndDate: new Date(),
    EndTime: new Date(),
    TransportationCost: 0,
    OnSiteCost: 0,
    LDId: 0,
    SDId: 0,
    SPId: 0,
    Status: "",
    IsLocked: false,
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: "",
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: "",
  };

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
    this.listActivityCollectionView.pageSize = this.listActivityPageIndex;
    this.listActivityCollectionView.refresh();
    this.listActivityCollectionView.refresh();
  }

  public listActivity(): void {
    if (!this.isDataLoaded) {
      setTimeout(() => {
        this.listActivityObservableArray = new ObservableArray();
        this.listActivityCollectionView = new CollectionView(this.listActivityObservableArray);
        this.listActivityCollectionView.pageSize = 15;
        this.listActivityCollectionView.trackChanges = true;
        this.listActivityCollectionView.refresh();
        this.listActivityFlexGrid.refresh();

        this.isProgressBarHidden = false;

        let id: number = 0;
        this.activatedRoute.params.subscribe(params => { id = params["id"]; });

        this.supportDetailService.listActivity(id);
        this.listActivitySub = this.supportDetailService.listActivityObservable.subscribe(
          data => {
            if (data.length > 0) {
              this.listActivityObservableArray = data;
              this.listActivityCollectionView = new CollectionView(this.listActivityObservableArray);
              this.listActivityCollectionView.pageSize = this.listActivityPageIndex;
              this.listActivityCollectionView.trackChanges = true;
              this.listActivityCollectionView.refresh();
              this.listActivityFlexGrid.refresh();
            }

            this.isDataLoaded = true;
            this.isProgressBarHidden = true;
            if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
          }
        );
      }, 100);
    }
  }

  public btnAddActivityClick(activityModalTemplate: TemplateRef<any>): void {
    this.activitiyModalRef = this.modalService.show(activityModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-xl"
    });

    this.activityModalHeaderTitle = "Add Activity";
    this.isActivityLoadingSpinnerHidden = false;
    this.isActivityContentHidden = true;
    this.isActivityNumberHidden = true;
    this.isAddClicked = true;
    this.listActivityUsers();
  }

  public totalCost: number = 0;
  public transportationCostTextChanged(): void {
    this.totalCost = this.supportDetailActivityModel.TransportationCost + this.supportDetailActivityModel.OnSiteCost;
  }

  public listActivityUsers(): void {
    this.supportDetailService.listActivityUsers();
    this.cboListActivityUsersSub = this.supportDetailService.listActivityUsersObservable.subscribe(
      data => {
        let usersObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            usersObservableArray.push({
              Id: data[i].Id,
              FullName: data[i].FullName,
              UserName: data[i].UserName
            });
          }
        }

        this.cboListActivityUsersObservableArray = usersObservableArray;
        setTimeout(() => {
          this.listActivityStatus();
        }, 100);
        if (this.cboListActivityUsersSub != null) this.cboListActivityUsersSub.unsubscribe();
      }
    );
  }

  public listActivityStatus(): void {
    this.supportDetailService.listActivityStatus();
    this.cboListActivityStatusSub = this.supportDetailService.listActivityStatusObservable.subscribe(
      data => {
        let statusObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            statusObservableArray.push({
              Id: data[i].Id,
              Status: data[i].Status
            });
          }
        }

        this.cboListActivityStatusObservableArray = statusObservableArray;
        setTimeout(() => {
          this.currentActivity();
        }, 100);

        this.isActivityLoadingSpinnerHidden = true;
        this.isActivityContentHidden = false;
        if (this.cboListActivityStatusSub != null) this.cboListActivityStatusSub.unsubscribe();
      }
    );
  }

  public currentActivity(): void {
    let SPId: number = 0;
    this.activatedRoute.params.subscribe(params => { SPId = params["id"]; });

    if (this.isAddClicked) {
      this.supportDetailActivityModel = {
        Id: 0,
        SPDate: this.supportModel.SPDate,
        SPNumber: this.supportModel.SPNumber,
        SPName: this.supportModel.Customer,
        ACNumber: "0000000000",
        ACDate: new Date(),
        UserId: 0,
        User: localStorage.getItem("username"),
        FunctionalUserId: this.supportModel.AssignedToUserId,
        FunctionalUser: "",
        TechnicalUserId: this.supportModel.AssignedToUserId,
        TechnicalUser: "",
        CRMStatus: this.supportModel.Status,
        Activity: "",
        StartDate: new Date(),
        StartTime: new Date(),
        EndDate: new Date(),
        EndTime: new Date(),
        TransportationCost: 0,
        OnSiteCost: 0,
        LDId: null,
        SDId: null,
        SPId: SPId,
        Status: "",
        IsLocked: false,
        CreatedByUserId: 0,
        CreatedByUser: "",
        CreatedDateTime: "",
        UpdatedByUserId: 0,
        UpdatedByUser: "",
        UpdatedDateTime: ""
      };
    } else {
      let currentActivity = this.listActivityCollectionView.currentItem;
      this.supportDetailActivityModel = {
        Id: currentActivity.Id,
        SPDate: this.supportModel.SPDate,
        SPNumber: this.supportModel.SPNumber,
        SPName: this.supportModel.Customer,
        ACNumber: currentActivity.ACNumber,
        ACDate: currentActivity.ACDate,
        UserId: currentActivity.UserId,
        User: currentActivity.User,
        FunctionalUserId: currentActivity.FunctionalUserId,
        FunctionalUser: currentActivity.FunctionalUser,
        TechnicalUserId: currentActivity.TechnicalUserId,
        TechnicalUser: currentActivity.TechnicalUser,
        CRMStatus: currentActivity.CRMStatus,
        Activity: currentActivity.Activity,
        StartDate: currentActivity.StartDate,
        StartTime: currentActivity.StartTime,
        EndDate: currentActivity.EndDate,
        EndTime: currentActivity.EndTime,
        TransportationCost: currentActivity.TransportationCost,
        OnSiteCost: currentActivity.OnSiteCost,
        LDId: currentActivity.LDId,
        SDId: currentActivity.SDId,
        SPId: currentActivity.SPId,
        Status: currentActivity.Status,
        IsLocked: currentActivity.IsLocked,
        CreatedByUserId: currentActivity.CreatedByUserId,
        CreatedByUser: currentActivity.CreatedByUser,
        CreatedDateTime: currentActivity.CreatedDateTime,
        UpdatedByUserId: currentActivity.UpdatedByUserId,
        UpdatedByUser: currentActivity.UpdatedByUser,
        UpdatedDateTime: currentActivity.UpdatedDateTime
      };
    }
  }

  public btnEditActivityClick(activityModalTemplate: TemplateRef<any>): void {
    this.activitiyModalRef = this.modalService.show(activityModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-xl"
    });

    this.activityModalHeaderTitle = "Edit Activity";
    this.isActivityLoadingSpinnerHidden = false;
    this.isActivityNumberHidden = false;
    this.isActivityContentHidden = true;
    this.isAddClicked = false;
    this.listActivityUsers();
  }

  public btnSaveActivityClick(): void {
    let btnSaveActivityClickCloseModal: Element = document.getElementById("btnSaveActivityClickCloseModal");
    let btnSaveActivity: Element = document.getElementById("btnSaveActivity");
    (<HTMLButtonElement>btnSaveActivityClickCloseModal).disabled = true;
    (<HTMLButtonElement>btnSaveActivity).disabled = true;

    this.supportDetailService.saveActivity(this.supportDetailActivityModel);
    this.saveActivitySub = this.supportDetailService.saveActivityObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully saved!", "Success");

          setTimeout(() => {
            this.activitiyModalRef.hide();
            this.isDataLoaded = false;
            this.listActivity();
          }, 100);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveActivityClickCloseModal).disabled = false;
          (<HTMLButtonElement>btnSaveActivity).disabled = false;
        }

        if (this.saveActivitySub != null) this.saveActivitySub.unsubscribe();
      }
    );
  }

  public btnDeleteActivityClick(activityDeleteModalTemplate: TemplateRef<any>): void {
    this.deleteActivitiyModalRef = this.modalService.show(activityDeleteModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
  }

  public btnConfirmDeleteAcitivityClick() {
    let btnConfirmDeleteAcitivity: Element = document.getElementById("btnConfirmDeleteAcitivity");
    let btnCloseConfirmDeleteAcitivityModal: Element = document.getElementById("btnCloseConfirmDeleteAcitivityModal");
    (<HTMLButtonElement>btnConfirmDeleteAcitivity).disabled = true;
    (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = true;

    let currentActivity = this.listActivityCollectionView.currentItem;
    this.supportDetailService.deleteActivity(currentActivity.Id);
    this.deleteActivitySub = this.supportDetailService.deleteActivityObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully deleted!", "Success");

          setTimeout(() => {
            this.deleteActivitiyModalRef.hide();
            this.isDataLoaded = false;
            this.listActivity();
          }, 100);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = false;
          (<HTMLButtonElement>btnConfirmDeleteAcitivity).disabled = false;
        }

        if (this.deleteActivitySub != null) this.deleteActivitySub.unsubscribe();
      }
    );
  }

  public btnPrintSupport(): void {
    let LDId: number = 0;

    this.activatedRoute.params.subscribe(params => { LDId = params["id"]; });
    this.casePrintCaseDialog.open(SupportDetailPrintDialogComponent, {
      width: '1000px',
      data: { objId: LDId },
      disableClose: true
    });
  }

  public btnPrintSupportActivity(): void {
    let currentActivityId: number = 0;
    currentActivityId = this.listActivityCollectionView.currentItem.Id;
    this.activitiyModalRef.hide()

    this.casePrintCaseDialog.open(SupportDetailActivityPrintDialogComponent, {
      width: '1000px',
      data: { objId: currentActivityId },
      disableClose: true
    });
  }

  ngOnDestry() {
    if (this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
    if (this.cboSalesDeliverySub != null) this.cboSalesDeliverySub.unsubscribe();
    if (this.cboAssignedToUserSub != null) this.cboAssignedToUserSub.unsubscribe();
    if (this.cboSupportStatusSub != null) this.cboSupportStatusSub.unsubscribe();
    if (this.detailSupportSub != null) this.detailSupportSub.unsubscribe();
    if (this.saveSupportSub != null) this.saveSupportSub.unsubscribe();
    if (this.lockSupportSub != null) this.lockSupportSub.unsubscribe();
    if (this.unlockSupportSub != null) this.unlockSupportSub.unsubscribe();
    if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
    if (this.cboListActivityUsersSub != null) this.cboListActivityUsersSub.unsubscribe();
    if (this.cboListActivityStatusSub != null) this.cboListActivityStatusSub.unsubscribe();
    if (this.saveActivitySub != null) this.saveActivitySub.unsubscribe();
    if (this.deleteActivitySub != null) this.deleteActivitySub.unsubscribe();
  }
}
