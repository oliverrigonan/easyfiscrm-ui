import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SalesDeliveryDetailModel } from './sales-detail.model';
import { SalesDetailService } from './sales-detail.service';
import { SalesDetailActivityModel } from './sales-detail-activitiy.model';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css']
})
export class SalesDetailComponent implements OnInit {

  constructor(
    private salesDetailService: SalesDetailService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  public detailSalesSub: any;
  public saveSalesSub: any;
  public lockSalesSub: any;
  public unlockSalesSub: any;

  public isLocked: boolean = false;

  public IsLoaded: Boolean = false;
  public listCustomerObservableArray: ObservableArray = new ObservableArray();
  public listCustomerCollectionView: CollectionView = new CollectionView(this.listCustomerObservableArray);
  public listCustomerPageIndex: number = 15;
  @ViewChild('listCustomerFlexGrid') listCustomerFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public selectedCustomer: string = "";


  public cboCustomerSub: any;
  public cboCustomerObservableArray: ObservableArray = new ObservableArray();
  public cboCustomerSelectedValue: number;

  public cboSalesInvoiceSub: any;
  public cboSalesInvoiceObservableArray: ObservableArray = new ObservableArray();

  public cboProductSub: any;
  public cboProductObservableArray: ObservableArray = new ObservableArray();

  public cboAssignedToUserSub: any;
  public cboAssignedToUserObservable: ObservableArray = new ObservableArray();

  public cboLeadSub: any;
  public cboLeadObservable: ObservableArray = new ObservableArray();

  public cboSalesStatusSub: any;
  public cboSalesStatusObservable: ObservableArray = new ObservableArray();

  public isDataLoaded: boolean = false;

  public customerModalRef: BsModalRef;

  public salesDeliveryDetailModel: SalesDeliveryDetailModel = {
    Id: 0,
    SDNumber: "",
    SDDate: new Date(),
    RenewalDate: new Date(),
    CustomerId: 0,
    Customer: "",
    SIId: 0,
    ProductId: 0,
    LDId: 0,
    ContactPerson: "",
    ContactPosition: "",
    ContactEmail: "",
    ContactPhoneNumber: "",
    Particulars: "",
    AssignedToUserId: 0,
    Status: "",
    IsLocked: false,
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: new Date(),
  }

  public activitiyModalRef: BsModalRef;
  public deleteActivitiyModalRef: BsModalRef;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public listActivityObservableArray: ObservableArray = new ObservableArray();
  public listActivityCollectionView: CollectionView = new CollectionView(this.listActivityObservableArray);
  public listActivityPageIndex: number = 15;
  @ViewChild('listActivityFlexGrid') listActivityFlexGrid: WjFlexGrid;
  // public isProgressBarHidden = false;
  // public isDataLoaded: boolean = false;

  // public isLoadingSpinnerHidden: boolean = false;
  // public isContentHidden: boolean = true;

  ngOnInit() {
    this.createCboProduct();
    this.createCboShowNumberOfRows();
  }

  public detailSales(): void {
    let id: number = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.salesDetailService.detailSales(id);
    this.detailSalesSub = this.salesDetailService.detailSalesObservable.subscribe(
      data => {
        this.salesDeliveryDetailModel.Id = data.Id;
        this.salesDeliveryDetailModel.SDNumber = data.SDNumber;
        this.salesDeliveryDetailModel.SDDate = data.SDDate;
        this.salesDeliveryDetailModel.RenewalDate = data.RenewalDate;
        this.salesDeliveryDetailModel.CustomerId = data.CustomerId;
        this.salesDeliveryDetailModel.Customer = data.Customer;
        this.salesDeliveryDetailModel.SIId = data.SIId;
        this.salesDeliveryDetailModel.ProductId = data.ProductId;
        this.salesDeliveryDetailModel.LDId = data.LDId;
        this.salesDeliveryDetailModel.ContactPerson = data.ContactPerson;
        this.salesDeliveryDetailModel.ContactPosition = data.ContactPosition;
        this.salesDeliveryDetailModel.ContactEmail = data.ContactEmail;
        this.salesDeliveryDetailModel.ContactPhoneNumber = data.ContactPhoneNumber;
        this.salesDeliveryDetailModel.Particulars = data.Particulars;
        this.salesDeliveryDetailModel.AssignedToUserId = data.AssignedToUserId;
        this.salesDeliveryDetailModel.Status = data.Status;
        this.salesDeliveryDetailModel.IsLocked = data.IsLocked;
        this.salesDeliveryDetailModel.CreatedByUserId = data.CreatedByUserId;
        this.salesDeliveryDetailModel.CreatedByUser = data.CreatedByUser;
        this.salesDeliveryDetailModel.CreatedDateTime = data.CreatedDateTime;
        this.salesDeliveryDetailModel.UpdatedByUserId = data.UpdatedByUserId;
        this.salesDeliveryDetailModel.UpdatedByUser = data.UpdatedByUser;
        this.salesDeliveryDetailModel.UpdatedDateTime = data.UpdatedDateTime;

        let btnSaveSales: Element = document.getElementById("btnSaveSales");
        let btnLockSales: Element = document.getElementById("btnLockSales");
        let btnUnlockSales: Element = document.getElementById("btnUnlockSales");

        this.selectedCustomer = data.Customer;

        (<HTMLButtonElement>btnSaveSales).disabled = false;
        (<HTMLButtonElement>btnLockSales).disabled = false;
        (<HTMLButtonElement>btnUnlockSales).disabled = true;

        if (data.IsLocked) {
          this.isLocked = true;

          (<HTMLButtonElement>btnSaveSales).disabled = true;
          (<HTMLButtonElement>btnLockSales).disabled = true;
          (<HTMLButtonElement>btnUnlockSales).disabled = false;

          this.isActivityTabHidden = false;
        }
        setTimeout(() => {
          this.createCboSalesInvoice(this.salesDeliveryDetailModel.CustomerId);
        }, 100);
        this.isLoadingSpinnerHidden = true;
        this.isContentHidden = false;

        if (this.detailSalesSub != null) this.detailSalesSub.unsubscribe();
      }
    );
  }

  public listCustomer(): void {
    this.listCustomerObservableArray = new ObservableArray();
    this.listCustomerCollectionView = new CollectionView(this.listCustomerObservableArray);
    this.listCustomerCollectionView.pageSize = 15;
    this.listCustomerCollectionView.trackChanges = true;
    this.listCustomerCollectionView.refresh();
    // this.listCustomerFlexGrid.refresh();

    this.isProgressBarHidden = false;
    this.salesDetailService.listCustomer();
    this.cboCustomerSub = this.salesDetailService.listCustomerObservable.subscribe(
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

  public createCboSalesInvoice(customerId: number): void {
    this.salesDetailService.listSalesInvoice(customerId);
    this.cboSalesInvoiceSub = this.salesDetailService.listSalesInvoiceObservable.subscribe(
      data => {
        let salesInvoiceObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            salesInvoiceObservableArray.push({
              Id: data[i].Id,
              SINumber: data[i].SINumber
            });
          }
        }

        this.cboSalesInvoiceObservableArray = salesInvoiceObservableArray;
        if (this.cboSalesInvoiceSub != null) this.cboSalesInvoiceSub.unsubscribe();
      }
    );
  }

  public createCboProduct(): void {
    this.salesDetailService.listProduct();
    this.cboProductSub = this.salesDetailService.listProductObservable.subscribe(
      data => {
        let productObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            productObservableArray.push({
              Id: data[i].Id,
              ProductDescription: data[i].ProductDescription
            });
          }
        }

        this.cboProductObservableArray = productObservableArray;

        setTimeout(() => {
          this.createCboLead();
        }, 100);
        if (this.cboProductSub != null) this.cboProductSub.unsubscribe();
      }
    );
  }

  public createCboLead(): void {
    this.salesDetailService.listLead();
    this.cboLeadSub = this.salesDetailService.listLeadObservable.subscribe(
      data => {
        let leadObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            leadObservableArray.push({
              Id: data[i].Id,
              LDNumber: data[i].LDNumber
            });
          }
        }

        this.cboLeadObservable = leadObservableArray;

        setTimeout(() => {
          this.createCboAssignedToUser();
        }, 100);
        if (this.cboLeadSub != null) this.cboLeadSub.unsubscribe();
      }
    );
  }

  public createCboAssignedToUser(): void {
    this.salesDetailService.listAssignedUsers();
    this.cboAssignedToUserSub = this.salesDetailService.listLeadAssignedToUsersObservable.subscribe(
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
          this.createCboSalesStatus();
        }, 100);
        if (this.cboAssignedToUserSub != null) this.cboAssignedToUserSub.unsubscribe();
      }
    );
  }

  public createCboSalesStatus(): void {
    this.salesDetailService.listSalesStatus();
    this.cboSalesStatusSub = this.salesDetailService.listSalesStatusObservable.subscribe(
      data => {
        let salesStatusObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            salesStatusObservableArray.push({
              Id: data[i].Id,
              Status: data[i].Status
            });
          }
        }

        this.cboSalesStatusObservable = salesStatusObservableArray;

        setTimeout(() => {
          this.detailSales();
        }, 100);
        if (this.cboSalesStatusSub != null) this.cboSalesStatusSub.unsubscribe();
      }
    );
  }

  public btnCustomerListClick(customerModalTemplate: TemplateRef<any>): void {
    if (!this.isLocked) {
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


  }

  public btnPickCustomerClick(): void {
    let currentCustomer = this.listCustomerCollectionView.currentItem;
    this.selectedCustomer = currentCustomer.Article;
    this.salesDeliveryDetailModel.CustomerId = currentCustomer.Id;

    this.customerModalRef.hide();

    this.createCboSalesInvoice(this.salesDeliveryDetailModel.CustomerId);
  }

  public btnSaveSalesClick(): void {
    let btnSaveSales: Element = document.getElementById("btnSaveSales");
    let btnLockSales: Element = document.getElementById("btnLockSales");
    let btnUnlockSales: Element = document.getElementById("btnUnlockSales");
    (<HTMLButtonElement>btnSaveSales).disabled = true;
    (<HTMLButtonElement>btnLockSales).disabled = true;
    (<HTMLButtonElement>btnUnlockSales).disabled = true;

    this.salesDetailService.saveSales(this.salesDeliveryDetailModel)
    this.saveSalesSub = this.salesDetailService.saveSalesObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Sales was successfully saved.", "Success");

          setTimeout(() => {
            (<HTMLButtonElement>btnSaveSales).disabled = false;
            (<HTMLButtonElement>btnLockSales).disabled = false;
            (<HTMLButtonElement>btnUnlockSales).disabled = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveSales).disabled = false;
          (<HTMLButtonElement>btnLockSales).disabled = false;
          (<HTMLButtonElement>btnUnlockSales).disabled = true;
        }

        if (this.saveSalesSub != null) this.saveSalesSub.unsubscribe();
      }
    );
  }

  public btnLockSalesClick(): void {
    let btnSaveSales: Element = document.getElementById("btnSaveSales");
    let btnLockSales: Element = document.getElementById("btnLockSales");
    let btnUnlockSales: Element = document.getElementById("btnUnlockSales");
    (<HTMLButtonElement>btnSaveSales).disabled = true;
    (<HTMLButtonElement>btnLockSales).disabled = true;
    (<HTMLButtonElement>btnUnlockSales).disabled = true;

    this.salesDetailService.lockSales(this.salesDeliveryDetailModel)
    this.lockSalesSub = this.salesDetailService.lockSalesObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Sales was successfully saved.", "Success");
          setTimeout(() => {
            this.isLocked = true;

            (<HTMLButtonElement>btnSaveSales).disabled = true;
            (<HTMLButtonElement>btnLockSales).disabled = true;
            (<HTMLButtonElement>btnUnlockSales).disabled = false;

            this.isActivityTabHidden = false;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnSaveSales).disabled = false;
          (<HTMLButtonElement>btnLockSales).disabled = false;
          (<HTMLButtonElement>btnUnlockSales).disabled = true;
        }
        if (this.lockSalesSub != null) this.lockSalesSub.unsubscribe();
      }
    );
  }

  public btnUnlockSalesClick(): void {
    this.isActivityTabHidden = true;

    let btnSaveSales: Element = document.getElementById("btnSaveSales");
    let btnLockSales: Element = document.getElementById("btnLockSales");
    let btnUnlockSales: Element = document.getElementById("btnUnlockSales");
    (<HTMLButtonElement>btnSaveSales).disabled = true;
    (<HTMLButtonElement>btnLockSales).disabled = true;
    (<HTMLButtonElement>btnUnlockSales).disabled = true;

    this.salesDetailService.unlockSales(this.salesDeliveryDetailModel);
    this.unlockSalesSub = this.salesDetailService.unlockSalesObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Sales was successfully unlocked.", "Success");

          setTimeout(() => {
            this.isLocked = false;

            (<HTMLButtonElement>btnSaveSales).disabled = false;
            (<HTMLButtonElement>btnLockSales).disabled = false;
            (<HTMLButtonElement>btnUnlockSales).disabled = true;

            this.isActivityTabHidden = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveSales).disabled = true;
          (<HTMLButtonElement>btnLockSales).disabled = true;
          (<HTMLButtonElement>btnUnlockSales).disabled = false;

          this.isActivityTabHidden = false;
        }
        if (this.unlockSalesSub != null) this.unlockSalesSub.unsubscribe();
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

  public salesDetailActivityModel: SalesDetailActivityModel = {
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
  }

  public listActivitySub: any;
  public saveActivitySub: any;
  public deleteActivitySub: any;

  public isActivityTabHidden: boolean = true;

  public activityModalHeaderTitle: string = "Activity";

  public cboListActivityUsersSub: any;
  public cboListActivityUsersObservableArray: ObservableArray = new ObservableArray();

  public cboListActivityStatusSub: any;
  public cboListActivityStatusObservableArray: ObservableArray = new ObservableArray();

  public isActivityLoadingSpinnerHidden: boolean = false;
  public isActivityContentHidden: boolean = true;
  public isActivityNumberHidden = false;

  public isAddClicked: boolean = false;

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

        this.salesDetailService.listActivity(id);
        this.listActivitySub = this.salesDetailService.listActivityObservable.subscribe(
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
            console.log("Hello world");
            if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
          }
        );
      }, 100);
    }
  }

  public listActivityUsers(): void {
    this.salesDetailService.listActivityUsers();
    this.cboListActivityUsersSub = this.salesDetailService.listActivityUsersObservable.subscribe(
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
    this.salesDetailService.listActivityStatus();
    this.cboListActivityStatusSub = this.salesDetailService.listActivityStatusObservable.subscribe(
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
    let SDId: number = 0;
    this.activatedRoute.params.subscribe(params => { SDId = params["id"]; });
    if (this.isAddClicked) {
      this.salesDetailActivityModel = {
        Id: 0,
        ACNumber: "0000000001",
        ACDate: new Date(),
        UserId: 0,
        User: localStorage.getItem("username"),
        FunctionalUserId: 0,
        FunctionalUser: "",
        TechnicalUserId: 0,
        TechnicalUser: "",
        CRMStatus: this.salesDeliveryDetailModel.Status,
        Activity: "",
        StartDate: new Date(),
        StartTime: new Date(),
        EndDate: new Date(),
        EndTime: new Date(),
        TransportationCost: 0,
        OnSiteCost: 0,
        LDId: null,
        SDId: SDId,
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
      this.salesDetailActivityModel = {
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
console.log(this.salesDetailActivityModel);
    this.salesDetailService.saveActivity(this.salesDetailActivityModel);
    this.saveActivitySub = this.salesDetailService.saveActivityObservable.subscribe(
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


  ngOnDestroy() {
    if (this.cboProductSub != null) this.cboProductSub.unsubscribe();
    if (this.cboSalesInvoiceSub != null) this.cboSalesInvoiceSub.unsubscribe();
    if (this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
    if (this.cboProductSub != null) this.cboProductSub.unsubscribe();
    if (this.cboLeadSub != null) this.cboLeadSub.unsubscribe();
    if (this.detailSalesSub != null) this.detailSalesSub.unsubscribe();
    if (this.saveSalesSub != null) this.saveSalesSub.unsubscribe();
    if (this.lockSalesSub != null) this.lockSalesSub.unsubscribe();
    if (this.unlockSalesSub != null) this.unlockSalesSub.unsubscribe();
  }

}
