import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { LeadDetailService } from './lead-detail.service';
import { LeadDetailModel } from './lead-detail.model';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { LeadDetailActivityModel } from './lead-detail-activitiy.model';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export class LeadDetailComponent implements OnInit {

  constructor(
    private leadDetailService: LeadDetailService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  public cboAssignedToUsersSub: any;
  public cboLeadAssignedToUsersObservableArray: ObservableArray = new ObservableArray();

  public cboListStatusSub: any;
  public cboLeadStatusObservableArray: ObservableArray = new ObservableArray();

  public detailLeadSub: any;
  public saveLeadSub: any;
  public lockLeadSub: any;
  public unlockLeadSub: any;

  public isLocked: boolean = false;
  public leadDetailModel: LeadDetailModel = {
    Id: 0,
    LDNumber: "",
    LDDate: new Date(),
    Name: "",
    Address: "",
    ContactPerson: "",
    ContactPosition: "",
    ContactEmail: "",
    ContactPhoneNumber: "",
    ReferredBy: "",
    Remarks: "",
    AssignedToUserId: 0,
    AssignedToUser: "",
    LastActivity: "",
    Status: "",
    IsLocked: false,
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: "",
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: ""
  };

  public activitiyModalRef: BsModalRef;
  public deleteActivitiyModalRef: BsModalRef;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public listActivityObservableArray: ObservableArray = new ObservableArray();
  public listActivityCollectionView: CollectionView = new CollectionView(this.listActivityObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listActivityFlexGrid') listActivityFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
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

  public leadDetailActivityModel: LeadDetailActivityModel = {
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
    LDId: null,
    SDId: null,
    SPId: null,
    Status: "",
    IsLocked: false,
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: "",
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: ""
  };

  public isAddClicked: boolean = false;

  public createCboAssignedToUser() {
    this.leadDetailService.listAssignedUsers();
    this.cboAssignedToUsersSub = this.leadDetailService.listLeadAssignedToUsersObservable.subscribe(
      data => {
        let assignedUsersObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            assignedUsersObservableArray.push({
              Id: data[i].Id,
              UserName: data[i].UserName,
              FullName: data[i].FullName
            });
          }
        }

        this.cboLeadAssignedToUsersObservableArray = assignedUsersObservableArray;
        if (this.cboLeadAssignedToUsersObservableArray.length > 0) {
          setTimeout(() => {
            this.createCboLeadStatus();
          }, 100);
        }

        if (this.cboAssignedToUsersSub != null) this.cboAssignedToUsersSub.unsubscribe();
      }
    );
  }

  public createCboLeadStatus(): void {
    this.leadDetailService.listStatus();
    this.cboListStatusSub = this.leadDetailService.listStatusObservable.subscribe(
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
            this.detailLead();
          }, 100);
        }

        if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
      }
    );
  }

  public detailLead(): void {
    let id: number = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.leadDetailService.detailLead(id);
    this.detailLeadSub = this.leadDetailService.detailLeadObservable.subscribe(
      data => {
        if (data != null) {
          this.leadDetailModel.Id = data.Id;
          this.leadDetailModel.LDNumber = data.LDNumber;
          this.leadDetailModel.LDDate = data.LDDate;
          this.leadDetailModel.Name = data.Name;
          this.leadDetailModel.Address = data.Address;
          this.leadDetailModel.ContactPerson = data.ContactPerson;
          this.leadDetailModel.ContactPosition = data.ContactPosition;
          this.leadDetailModel.ContactEmail = data.ContactEmail;
          this.leadDetailModel.ContactPhoneNumber = data.ContactPhoneNumber;
          this.leadDetailModel.ReferredBy = data.ReferredBy;
          this.leadDetailModel.Remarks = data.Remarks;
          this.leadDetailModel.AssignedToUserId = data.AssignedToUserId;
          this.leadDetailModel.Status = data.Status;
          this.leadDetailModel.IsLocked = data.IsLocked;
          this.leadDetailModel.CreatedByUserId = data.CreatedByUserId;
          this.leadDetailModel.CreatedByUser = data.CreatedByUser;
          this.leadDetailModel.CreatedDateTime = data.CreatedDateTime;
          this.leadDetailModel.UpdatedByUserId = data.UpdatedByUserId;
          this.leadDetailModel.UpdatedByUser = data.UpdatedByUser;
          this.leadDetailModel.UpdatedDateTime = data.UpdatedDateTime;

          let btnSaveLead: Element = document.getElementById("btnSaveLead");
          let btnLockLead: Element = document.getElementById("btnLockLead");
          let btnUnlockLead: Element = document.getElementById("btnUnlockLead");

          (<HTMLButtonElement>btnSaveLead).disabled = false;
          (<HTMLButtonElement>btnLockLead).disabled = false;
          (<HTMLButtonElement>btnUnlockLead).disabled = true;

          if (data.IsLocked) {
            this.isLocked = true;

            (<HTMLButtonElement>btnSaveLead).disabled = true;
            (<HTMLButtonElement>btnLockLead).disabled = true;
            (<HTMLButtonElement>btnUnlockLead).disabled = false;

            this.isActivityTabHidden = false;
          }

          this.isLoadingSpinnerHidden = true;
          this.isContentHidden = false;
        }

        if (this.detailLeadSub != null) this.detailLeadSub.unsubscribe();
      }
    );
  }

  public btnSaveLeadClick(): void {
    let btnSaveLead: Element = document.getElementById("btnSaveLead");
    let btnLockLead: Element = document.getElementById("btnLockLead");
    let btnUnlockLead: Element = document.getElementById("btnUnlockLead");
    (<HTMLButtonElement>btnSaveLead).disabled = true;
    (<HTMLButtonElement>btnLockLead).disabled = true;
    (<HTMLButtonElement>btnUnlockLead).disabled = true;

    this.leadDetailService.saveLead(this.leadDetailModel);
    this.saveLeadSub = this.leadDetailService.saveLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully saved.", "Success");

          setTimeout(() => {
            (<HTMLButtonElement>btnSaveLead).disabled = false;
            (<HTMLButtonElement>btnLockLead).disabled = false;
            (<HTMLButtonElement>btnUnlockLead).disabled = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveLead).disabled = false;
          (<HTMLButtonElement>btnLockLead).disabled = false;
          (<HTMLButtonElement>btnUnlockLead).disabled = true;
        }

        if (this.saveLeadSub != null) this.saveLeadSub.unsubscribe();
      }
    );
  }

  public btnLockLeadClick(): void {
    let btnSaveLead: Element = document.getElementById("btnSaveLead");
    let btnLockLead: Element = document.getElementById("btnLockLead");
    let btnUnlockLead: Element = document.getElementById("btnUnlockLead");
    (<HTMLButtonElement>btnSaveLead).disabled = true;
    (<HTMLButtonElement>btnLockLead).disabled = true;
    (<HTMLButtonElement>btnUnlockLead).disabled = true;

    this.leadDetailService.lockLead(this.leadDetailModel);
    this.lockLeadSub = this.leadDetailService.lockLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully locked.", "Success");

          setTimeout(() => {
            this.isLocked = true;

            (<HTMLButtonElement>btnSaveLead).disabled = true;
            (<HTMLButtonElement>btnLockLead).disabled = true;
            (<HTMLButtonElement>btnUnlockLead).disabled = false;

            this.isActivityTabHidden = false;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveLead).disabled = false;
          (<HTMLButtonElement>btnLockLead).disabled = false;
          (<HTMLButtonElement>btnUnlockLead).disabled = true;
        }

        if (this.lockLeadSub != null) this.lockLeadSub.unsubscribe();
      }
    );
  }

  public btnUnlockLeadClick(): void {
    this.isActivityTabHidden = true;

    let btnSaveLead: Element = document.getElementById("btnSaveLead");
    let btnLockLead: Element = document.getElementById("btnLockLead");
    let btnUnlockLead: Element = document.getElementById("btnUnlockLead");
    (<HTMLButtonElement>btnSaveLead).disabled = true;
    (<HTMLButtonElement>btnLockLead).disabled = true;
    (<HTMLButtonElement>btnUnlockLead).disabled = true;

    this.leadDetailService.unlockLead(this.leadDetailModel);
    this.unlockLeadSub = this.leadDetailService.unlockLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully unlocked.", "Success");

          setTimeout(() => {
            this.isLocked = false;

            (<HTMLButtonElement>btnSaveLead).disabled = false;
            (<HTMLButtonElement>btnLockLead).disabled = false;
            (<HTMLButtonElement>btnUnlockLead).disabled = true;

            this.isActivityTabHidden = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveLead).disabled = true;
          (<HTMLButtonElement>btnLockLead).disabled = true;
          (<HTMLButtonElement>btnUnlockLead).disabled = false;

          this.isActivityTabHidden = false;
        }

        if (this.unlockLeadSub != null) this.unlockLeadSub.unsubscribe();
      }
    );
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
    this.listActivityPageIndex = selectedValue;

    this.listActivityCollectionView.pageSize = this.listActivityPageIndex;
    this.listActivityCollectionView.refresh();
    this.listActivityCollectionView.refresh();
  }

  public totalCost: number = 0;
  public transportationCostTextChanged(): void {
    this.totalCost = this.leadDetailActivityModel.TransportationCost + this.leadDetailActivityModel.OnSiteCost;
  }

  public OnSiteCostTextChanged(): void {
    this.totalCost = this.leadDetailActivityModel.TransportationCost + this.leadDetailActivityModel.OnSiteCost;
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

        this.leadDetailService.listActivity(id);
        this.listActivitySub = this.leadDetailService.listActivityObservable.subscribe(
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

  public listActivityUsers(): void {
    this.leadDetailService.listActivityUsers();
    this.cboListActivityUsersSub = this.leadDetailService.listActivityUsersObservable.subscribe(
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
    this.leadDetailService.listActivityStatus();
    this.cboListActivityStatusSub = this.leadDetailService.listActivityStatusObservable.subscribe(
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
    let LDId: number = 0;
    this.activatedRoute.params.subscribe(params => { LDId = params["id"]; });

    this.leadDetailActivityModel.FunctionalUserId = this.leadDetailModel.AssignedToUserId;
    this.leadDetailActivityModel.TechnicalUserId = this.leadDetailModel.AssignedToUserId;
    if (this.isAddClicked) {
      this.leadDetailActivityModel = {
        Id: 0,
        ACNumber: "0000000001",
        ACDate: new Date(),
        UserId: 0,
        User: localStorage.getItem("username"),
        FunctionalUserId: this.leadDetailModel.AssignedToUserId,
        FunctionalUser: "",
        TechnicalUserId: this.leadDetailModel.AssignedToUserId,
        TechnicalUser: "",
        CRMStatus: this.leadDetailModel.Status,
        Activity: "",
        StartDate: new Date(),
        StartTime: new Date(),
        EndDate: new Date(),
        EndTime: new Date(),
        TransportationCost: 0,
        OnSiteCost: 0,
        LDId: LDId,
        SDId: null,
        SPId: null,
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
      this.leadDetailActivityModel = {
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

    this.leadDetailService.saveActivity(this.leadDetailActivityModel);
    this.saveActivitySub = this.leadDetailService.saveActivityObservable.subscribe(
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
    this.leadDetailService.deleteActivity(currentActivity.Id);
    this.deleteActivitySub = this.leadDetailService.deleteActivityObservable.subscribe(
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

  ngOnInit() {
    this.createCboAssignedToUser();
    this.createCboShowNumberOfRows();
  }

  ngOnDestroy() {
    if (this.cboAssignedToUsersSub != null) this.cboAssignedToUsersSub.unsubscribe();
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.detailLeadSub != null) this.detailLeadSub.unsubscribe();
    if (this.lockLeadSub != null) this.lockLeadSub.unsubscribe();
    if (this.unlockLeadSub != null) this.unlockLeadSub.unsubscribe();

    if (this.cboListActivityUsersSub != null) this.cboListActivityUsersSub.unsubscribe();
    if (this.cboListActivityStatusSub != null) this.cboListActivityStatusSub.unsubscribe();

    if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
    if (this.saveActivitySub != null) this.saveActivitySub.unsubscribe();
    if (this.deleteActivitySub != null) this.deleteActivitySub.unsubscribe();
  }
}