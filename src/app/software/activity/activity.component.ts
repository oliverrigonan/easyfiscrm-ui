import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ToastrService } from 'ngx-toastr';
import { ActivityService } from './activity.service';
import { ActivityModel } from './activity.model';
import { ActivityHeaderModel } from './activity-header.model';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  constructor(
    private activityService: ActivityService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getFirsDayOftheMonth();
    this.createCboShowNumberOfRows();
    this.createCboActivityDocument();
    this.createCboActivityStatus();
    this.createCboActivityUser();
    
  }

  // ===============
  // Activity Header
  // ===============
  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public ActivityStartDateFilterData = new Date();
  public ActivityEndDateFilterData = new Date();

  public cboActivityFunctionalObservableArray: ObservableArray = new ObservableArray();
  public cboActivityUserSelectedValue: number = 0;

  public cboActivityStatusObservableArray: ObservableArray = new ObservableArray();
  public cboActivityStatusSelectedValue: string = "Open";

  public cboActivityDocumentObservableArray: ObservableArray = new ObservableArray();
  public cboActivityDocumentSelectedValue: string = "Open";

  public clistActivityHeaderObservableArray: ObservableArray = new ObservableArray();
  public listActivityHeaderCollectionView: CollectionView = new CollectionView(this.clistActivityHeaderObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listActivityFlexGrid') listActivityFlexGrid: WjFlexGrid;
  public isProgressBarHidden = true;
  public isDataLoaded: boolean = false;

  public cboListUserSub: any;
  public cboListDocumentSub: any;
  public cboListStatusSub: any;
  public listActivityHeaderSub: any;

  // ========
  // Activity
  // ========
  public activityListModalRef: BsModalRef;
  public modalcboShowNumberOfRows: ObservableArray = new ObservableArray();
  public listActivitySub: any;

  public modalListActivityObservableArray: ObservableArray = new ObservableArray();
  public modalListActivityCollectionView: CollectionView = new CollectionView(this.modalListActivityObservableArray);
  public modalListActivityPageIndex: number = 15;
  @ViewChild('modalListActivityFlexGrid') modalListActivityFlexGrid: WjFlexGrid;

  public modallistActivitySub: any;
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
  public isActivityDataLoaded: boolean = false;

  public activityModel: ActivityModel = {
    Id: 0,
    DocNumber: "",
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

  public activityHeaderModel: ActivityHeaderModel = {
    docType: "",
    reference: "",
    particular: "",
    assignedToId: 0,
    assignedTo: "",
    createdBy: "",
    product: "",
    status: "",
  };

  // ===============
  // Activity Header
  // ===============
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

    this.listActivityHeaderCollectionView.pageSize = this.listActivityPageIndex;
    this.listActivityHeaderCollectionView.refresh();
    this.listActivityHeaderCollectionView.refresh();
  }

  public getFirsDayOftheMonth() {
    var date = new Date();
    this.ActivityStartDateFilterData = new Date(date.getFullYear(), date.getMonth(), 1);
    this.ActivityEndDateFilterData = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  public cboStartDateTextChanged(): void {
  }

  public cboEndDateTextChanged(): void {
  }

  // =============
  // ComboBox User
  // =============
  public createCboActivityUser(): void {
    this.activityService.listUser();
    this.cboListUserSub = this.activityService.listUserObservable.subscribe(
      data => {
        let userObservableArray = new ObservableArray();
        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            userObservableArray.push({
              Id: data[i].Id,
              UserName: data[i].UserName,
              FullName: data[i].FullName
            });
          }
        }

        this.cboActivityFunctionalObservableArray = userObservableArray;
        if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
      }
    );
  }

  public cboActivityUserSelectedIndexChanged(selectedValue: any): void {
    this.cboActivityUserSelectedValue = selectedValue;

    if (this.isDataLoaded) {
      setTimeout(() => {
        this.createCboActivityStatus();
      }, 100);
    }
  }

  // =================
  // ComboBox Document
  // =================
  public createCboActivityDocument(): void {
    this.activityService.listDocument();
    this.cboListDocumentSub = this.activityService.listDocumentObservable.subscribe(
      data => {
        let documentObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            documentObservableArray.push({
              Id: data[i].Id,
              Category: data[i].Category
            });
          }
        }

        this.cboActivityDocumentObservableArray = documentObservableArray;
        if (this.cboListDocumentSub != null) this.cboListDocumentSub.unsubscribe();
      }
    );
  }

  public cboDocumentSelectedIndexChanged(selectedValue: any): void {
    this.cboActivityDocumentSelectedValue = selectedValue;
  }

  // ===============
  // ComboBox Status
  // ===============
  public createCboActivityStatus(): void {
    this.activityService.listStatus();
    this.cboListStatusSub = this.activityService.listStatusObservable.subscribe(
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
        this.cboActivityStatusObservableArray = statusObservableArray;
        if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
      }
    );
  }

  public cboActivityStatusSelectedIndexChanged(selectedValue: any): void {
    this.cboActivityStatusSelectedValue = selectedValue;
  }

  public btnGetActivityClick(): void {
    this.listActivityHeader();
  }

  // ====================
  // Activity Header List
  // ====================
  public listActivityHeader(): void {
    this.clistActivityHeaderObservableArray = new ObservableArray();
    this.listActivityHeaderCollectionView = new CollectionView(this.clistActivityHeaderObservableArray);
    this.listActivityHeaderCollectionView.pageSize = 15;
    this.listActivityHeaderCollectionView.trackChanges = true;
    this.listActivityHeaderCollectionView.refresh();
    this.listActivityFlexGrid.refresh();

    let startDate = [this.ActivityStartDateFilterData.getFullYear(), this.ActivityStartDateFilterData.getMonth() + 1, this.ActivityStartDateFilterData.getDate()].join('-');
    let endDate = [this.ActivityEndDateFilterData.getFullYear(), this.ActivityEndDateFilterData.getMonth() + 1, this.ActivityEndDateFilterData.getDate()].join('-');

    this.isProgressBarHidden = false;

    this.activityService.listActivityHeader(startDate, endDate, this.cboActivityDocumentSelectedValue, this.cboActivityStatusSelectedValue, this.cboActivityUserSelectedValue);
    this.listActivityHeaderSub = this.activityService.listActivityHeadingObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.clistActivityHeaderObservableArray = data;
          this.listActivityHeaderCollectionView = new CollectionView(this.clistActivityHeaderObservableArray);
          this.listActivityHeaderCollectionView.pageSize = this.listActivityPageIndex;
          this.listActivityHeaderCollectionView.trackChanges = true;
          this.listActivityHeaderCollectionView.refresh();
          this.listActivityFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listActivityHeaderSub != null) this.listActivityHeaderSub.unsubscribe();
      }
    );
  }

  // ====================
  // Activity Header Edit
  // ====================
  public btnEditActivityListClick(activityListModalTemplate: TemplateRef<any>): void {
    this.activityModalHeaderTitle = "Activity List";
    this.modalCreateCboShowNumberOfRows();
    this.isActivityDataLoaded = false;

    let currentActivityHeader = this.listActivityHeaderCollectionView.currentItem;
    this.activityHeaderModel.docType = currentActivityHeader.Document;
    this.activityHeaderModel.reference = currentActivityHeader.DocumentNumber;
    this.activityHeaderModel.assignedTo = currentActivityHeader.AssignedTo;
    this.activityHeaderModel.createdBy = currentActivityHeader.CreatedBy;
    this.activityHeaderModel.product = currentActivityHeader.Product;
    this.activityHeaderModel.status = currentActivityHeader.Status;
    this.activityHeaderModel.particular = currentActivityHeader.Particulars;
    this.activityListModalRef = this.modalService.show(activityListModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-xl"
    });
    this.listActivity();
  }

  // ========
  // Activity
  // ========

  public modalCreateCboShowNumberOfRows(): void {
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

      this.modalcboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public modalCboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.listActivityPageIndex = selectedValue;

    this.modalListActivityCollectionView.pageSize = this.listActivityPageIndex;
    this.modalListActivityCollectionView.refresh();
    this.modalListActivityCollectionView.refresh();
  }

  // =============
  // Activity List
  // =============
  public listActivity(): void {
    if (!this.isActivityDataLoaded) {
      setTimeout(() => {
        this.modalListActivityObservableArray = new ObservableArray();
        this.modalListActivityCollectionView = new CollectionView(this.modalListActivityObservableArray);
        this.modalListActivityCollectionView.pageSize = 15;
        this.modalListActivityCollectionView.trackChanges = true;
        this.modalListActivityCollectionView.refresh();
        this.listActivityFlexGrid.refresh();

        this.isProgressBarHidden = false;

        let currentActivityHeader = this.listActivityHeaderCollectionView.currentItem;

        this.activityService.listActivity(currentActivityHeader.Document, currentActivityHeader.DocumentId);
        this.listActivitySub = this.activityService.listActivityObservable.subscribe(
          data => {
            if (data.length > 0) {
              this.modalListActivityObservableArray = data;
              this.modalListActivityCollectionView = new CollectionView(this.modalListActivityObservableArray);
              this.modalListActivityCollectionView.pageSize = this.listActivityPageIndex;
              this.modalListActivityCollectionView.trackChanges = true;
              this.modalListActivityCollectionView.refresh();
              this.listActivityFlexGrid.refresh();
            }

            this.isActivityDataLoaded = true;
            this.isProgressBarHidden = true;

            if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
          }
        );
      }, 100);
    }
  }

  // =======================
  // Current Activity Detail
  // =======================
  public currentActivity(): void {
    let currentActivityHeader = this.listActivityHeaderCollectionView.currentItem;
    let leadId: number;
    let salesDeliveryId: number;
    let supportId: number;

    if (currentActivityHeader.Document == "LEAD") {
      leadId = currentActivityHeader.Id;
      salesDeliveryId = null;
      supportId = null;
    }

    if (currentActivityHeader.Document == "SALES DELIVERY") {
      leadId = null;
      salesDeliveryId = currentActivityHeader.Id;
      supportId = null;
    }

    if (currentActivityHeader.Document == "SUPPORT") {
      leadId = null;
      salesDeliveryId = null;
      supportId = currentActivityHeader.Id;
    }
    if (this.isAddClicked) {
      this.activityModel = {
        Id: 0,
        DocNumber: this.activityHeaderModel.reference,
        ACNumber: "0000000000",
        ACDate: new Date(),
        UserId: 0,
        User: localStorage.getItem("username"),
        FunctionalUserId: currentActivityHeader.AssignedToId,
        FunctionalUser: currentActivityHeader.AssignedTo,
        TechnicalUserId: currentActivityHeader.AssignedToId,
        TechnicalUser: currentActivityHeader.AssignedTo,
        CRMStatus: this.activityModel.Status,
        Activity: "",
        StartDate: new Date(),
        StartTime: new Date(),
        EndDate: new Date(),
        EndTime: new Date(),
        TransportationCost: 0,
        OnSiteCost: 0,
        LDId: leadId,
        SDId: salesDeliveryId,
        SPId: supportId,
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
      let currentActivity = this.modalListActivityCollectionView.currentItem;
      this.activityModel = {
        Id: currentActivity.Id,
        DocNumber: this.activityHeaderModel.reference,
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

  // ====================
  // Add Activity - Modal
  // ====================
  public btnAddActivityClick(activityModalTemplate: TemplateRef<any>): void {
    this.activitiyModalRef = this.modalService.show(activityModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-xl"
    });

    this.isAddClicked = true;

    this.activityModalHeaderTitle = "Add Activity";
    this.isActivityNumberHidden = true;

    this.isActivityLoadingSpinnerHidden = false;
    this.isActivityContentHidden = true;

    this.listActivityUsers();
  }

  // =====================
  // Edit Activity - Modal
  // =====================
  public btnEditActivityClick(activityModalTemplate: TemplateRef<any>): void {
    this.activitiyModalRef = this.modalService.show(activityModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-xl"
    });

    this.isAddClicked = false;

    this.activityModalHeaderTitle = "Edit Activity";
    this.isActivityNumberHidden = false;

    this.isActivityLoadingSpinnerHidden = false;
    this.isActivityContentHidden = true;

    this.listActivityUsers();
  }

  // =============
  // Save Activity
  // =============
  public btnSaveActivityClick(): void {
    let btnSaveActivity: Element = document.getElementById("btnSaveActivity");
    let btnSaveActivityClickCloseModal: Element = document.getElementById("btnSaveActivityClickCloseModal");
    (<HTMLButtonElement>btnSaveActivity).disabled = true;
    (<HTMLButtonElement>btnSaveActivityClickCloseModal).disabled = true;

    this.activityService.saveActivity(this.activityModel);
    this.saveActivitySub = this.activityService.saveActivityObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Activity was successfully saved.", "Success");

          setTimeout(() => {
            this.isActivityDataLoaded = false;

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

  // ==============
  // Delete - Modal
  // ==============
  public btnDeleteActivityClick(activityDeleteModalTemplate: TemplateRef<any>): void {
    this.deleteActivitiyModalRef = this.modalService.show(activityDeleteModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
  }

  public btnCloseActivity(): void {
    this.activityListModalRef.hide();
    this.listActivityHeader();
  }

  // ===============
  // Delete Activity
  // ===============
  public btnConfirmDeleteAcitivityClick() {
    let btnConfirmDeleteAcitivity: Element = document.getElementById("btnConfirmDeleteAcitivity");
    let btnCloseConfirmDeleteAcitivityModal: Element = document.getElementById("btnCloseConfirmDeleteAcitivityModal");
    (<HTMLButtonElement>btnConfirmDeleteAcitivity).disabled = true;
    (<HTMLButtonElement>btnCloseConfirmDeleteAcitivityModal).disabled = true;

    let currentActivity = this.modalListActivityCollectionView.currentItem;
    this.activityService.deleteActivity(currentActivity.Id);
    this.deleteActivitySub = this.activityService.deleteActivityObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully deleted.", "Success");

          setTimeout(() => {
            this.isActivityDataLoaded = false;

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
  public totalCost: number = 0;
  public transportationCostTextChanged(): void {
    this.totalCost = this.activityModel.TransportationCost + this.activityModel.OnSiteCost;
  }

  // ========================
  // ComboBox Activity - User
  // ========================
  public listActivityUsers(): void {
    this.activityService.listActivityUsers();
    this.cboListActivityUsersSub = this.activityService.listActivityUsersObservable.subscribe(
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

  // ==========================
  // ComboBox Activity - Status
  // ==========================
  public listActivityStatus(): void {
    this.activityService.listActivityStatus();
    this.cboListActivityStatusSub = this.activityService.listActivityStatusObservable.subscribe(
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
        }, 300);

        this.isActivityLoadingSpinnerHidden = true;
        this.isActivityContentHidden = false;

        if (this.cboListActivityStatusSub != null) this.cboListActivityStatusSub.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    if (this.cboListUserSub != null) this.cboListUserSub.unsubscribe();
    if (this.cboListDocumentSub != null) this.cboListDocumentSub.unsubscribe();
    if (this.cboListStatusSub != null) this.cboListStatusSub.unsubscribe();
    if (this.listActivityHeaderSub != null) this.listActivityHeaderSub.unsubscribe();
    if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
    if (this.saveActivitySub != null) this.saveActivitySub.unsubscribe();
    if (this.cboListActivityUsersSub != null) this.cboListActivityUsersSub.unsubscribe();
    if (this.cboListActivityStatusSub != null) this.cboListActivityStatusSub.unsubscribe();
    if (this.deleteActivitySub != null) this.deleteActivitySub.unsubscribe();
  }
}
