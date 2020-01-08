import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SupportDetailService } from './support-detail.service';
import { SupportModel } from '../support-list/support-list.model';
import { SupportDetailActivityModel } from './support-detail-activity.model';

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

  public cboAssignedToUserSub: any;
  public cboAssignedToUserObservable: ObservableArray = new ObservableArray();

  public cboSupportStatusSub: any;
  public cboSupportStatusObservable: ObservableArray = new ObservableArray();

  public cboSalesDeliverySub: any;
  public cboSalesDeliveryObservable: ObservableArray = new ObservableArray();

  public saveSupportSub: any;
  public lockSupportSub: any;
  public unlockSupportSub: any;

  public isLocked: Boolean = false;

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
        console.log(this.listCustomerCollectionView);

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

    this.createCboSalesDelivery(this.supportModel.CustomerId);
  }

  public createCboSalesDelivery(customerId: number): void {
    this.supportDetailService.listSalesDelivery(customerId);
    this.cboSalesDeliverySub = this.supportDetailService.listSalesDeliveryObservable.subscribe(
      data => {
        let salesInvoiceObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            salesInvoiceObservableArray.push({
              Id: data[i].Id,
              SDNumber: data[i].SDNumber
            });
          }
        } else {
          this.toastr.error("No Sales Delivery");
        }

        this.cboSalesDeliveryObservable = salesInvoiceObservableArray;
        if (this.cboSalesDeliverySub != null) this.cboSalesDeliverySub.unsubscribe();
      }
    );
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
        this.supportModel.Id = data.Id;
        this.supportModel.SPNumber = data.SPNumber;
        this.supportModel.CustomerId = data.CustomerId;
        this.supportModel.Customer = data.Customer;
        this.supportModel.SDId = data.SDId;
        this.supportModel.ContactPerson = data.ContactPerson;
        this.supportModel.ContactPosition = data.ContactPosition;
        this.supportModel.ContactEmail = data.ContactEmail;
        this.supportModel.ContactPhoneNumber = data.ContactPhoneNumber;
        this.supportModel.Issue = data.Issue;
        this.supportModel.AssignedToUserId = data.AssignedToUserId;
        this.supportModel.AssignedToUserId = data.AssignedToUserId;
        this.supportModel.Status = data.Status;
        this.supportModel.IsLocked = data.IsLocked;
        this.supportModel.CreatedByUserId = data.CreatedByUserId;
        this.supportModel.CreatedByUser = data.CreatedByUser;
        this.supportModel.CreatedDateTime = data.CreatedDateTime;
        this.supportModel.UpdatedByUserId = data.UpdatedByUserId;
        this.supportModel.UpdatedByUser = data.UpdatedByUser;
        this.supportModel.UpdatedDateTime = data.UpdatedDateTime;

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
        setTimeout(() => {
          this.createCboSalesDelivery(this.supportModel.CustomerId);
        }, 100);
        this.isLoadingSpinnerHidden = true;
        this.isContentHidden = false;

        if (this.detailSupportSub != null) this.detailSupportSub.unsubscribe();
      }
    );
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
          this.toastr.success("Support was successfully saved.", "Success");

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
          this.toastr.success("Support was successfully locked.", "Success");

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
    this.isActivityTabHidden = true;

    let btnSaveSupport: Element = document.getElementById("btnSaveSupport");
    let btnLockSupport: Element = document.getElementById("btnLockSupport");
    let btnUnlockSupport: Element = document.getElementById("btnUnlockSupport");
    (<HTMLButtonElement>btnSaveSupport).disabled = true;
    (<HTMLButtonElement>btnLockSupport).disabled = true;
    (<HTMLButtonElement>btnUnlockSupport).disabled = true;

    this.supportDetailService.unlockSupport(this.supportModel);
    this.unlockSupportSub = this.supportDetailService.unlockSupportObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Support was successfully unlocked.", "Success");

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

  public supportDetailActivityModel: SupportDetailActivityModel = {
    Id: 0,
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

  public isAddClicked: boolean = false;

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
      class: ""
    });

    this.isAddClicked = true;

    this.activityModalHeaderTitle = "Add Activity";
    this.isActivityNumberHidden = true;

    this.isActivityLoadingSpinnerHidden = false;
    this.isActivityContentHidden = true;

    this.listActivityUsers();
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
        ACNumber: "0000000001",
        ACDate: new Date(),
        UserId: 0,
        User: localStorage.getItem("username"),
        FunctionalUserId: 0,
        FunctionalUser: "",
        TechnicalUserId: 0,
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
      class: ""
    });

    this.isAddClicked = false;

    this.activityModalHeaderTitle = "Edit Activity";
    this.isActivityNumberHidden = false;

    this.isActivityLoadingSpinnerHidden = false;
    this.isActivityContentHidden = true;

    this.listActivityUsers();
  }

  public btnSaveActivityClick(): void {
    let btnSaveActivity: Element = document.getElementById("btnSaveActivity");
    let btnSaveActivityClickCloseModal: Element = document.getElementById("btnSaveActivityClickCloseModal");
    (<HTMLButtonElement>btnSaveActivity).disabled = true;
    (<HTMLButtonElement>btnSaveActivityClickCloseModal).disabled = true;

    this.supportDetailService.saveActivity(this.supportDetailActivityModel);
    this.saveActivitySub = this.supportDetailService.saveActivityObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Activity was successfully saved.", "Success");

          setTimeout(() => {
            this.isDataLoaded = false;

            this.listActivity();
            this.activitiyModalRef.hide();
          }, 100);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveActivity).disabled = false;
          (<HTMLButtonElement>btnSaveActivityClickCloseModal).disabled = false;
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
          this.toastr.success("Lead was successfully deleted.", "Success");

          setTimeout(() => {
            this.isDataLoaded = false;

            this.listActivity();
            this.deleteActivitiyModalRef.hide();
          }, 100);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnConfirmDeleteAcitivity).disabled = false;
          (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = false;
        }

        if (this.deleteActivitySub != null) this.deleteActivitySub.unsubscribe();
      }
    );
  }

  ngOnDestry(){
    if (this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
    if (this.detailSupportSub != null) this.detailSupportSub.unsubscribe();
    if (this.cboSupportStatusSub != null) this.cboSupportStatusSub.unsubscribe();
    if (this.cboAssignedToUserSub != null) this.cboAssignedToUserSub.unsubscribe();
    if (this.cboSalesDeliverySub != null) this.cboSalesDeliverySub.unsubscribe();
    if (this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
    if (this.saveSupportSub != null) this.saveSupportSub.unsubscribe();
    if (this.lockSupportSub != null) this.lockSupportSub.unsubscribe();
    if (this.unlockSupportSub != null) this.unlockSupportSub.unsubscribe();
  }
}
