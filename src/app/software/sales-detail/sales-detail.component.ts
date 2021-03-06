import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SalesDeliveryDetailModel } from './sales-detail.model';
import { SalesDetailService } from './sales-detail.service';
import { SalesDetailActivityModel } from './sales-detail-activitiy.model';
import { SalesDetailPrintDialogComponent } from './sales-detail-print-dialog/sales-detail-print-dialog.component';
import { SalesDeliveryActivityPrintDialogComponent } from './sales-delivery-activity-print-dialog/sales-delivery-activity-print-dialog.component';
import { DocumentModel } from '../document/document.model';
import { DocumentService } from '../document/document.service';
import { DocumentDeleteComponent } from '../document/document-delete/document-delete.component';
import { SecurityService } from '../security/security.service';
import { DocumentComponent } from '../document/document/document.component';

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
    public caseDetailCaseDialog: MatDialog,
    private documentService: DocumentService,
    private securityService: SecurityService
  ) { }

  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  public detailSalesSub: any;
  public saveSalesSub: any;
  public lockSalesSub: any;
  public unlockSalesSub: any;

  public isLocked: boolean = false;

  // ========
  // Combobox
  // ========

  public cboSalesInvoiceSub: any;
  public cboSalesInvoiceObservableArray: ObservableArray = new ObservableArray();

  public cboProductSub: any;
  public cboProductObservableArray: ObservableArray = new ObservableArray();

  public cboAssignedToUserSub: any;
  public cboAssignedToUserObservable: ObservableArray = new ObservableArray();

  public cboSalesStatusSub: any;
  public cboSalesStatusObservable: ObservableArray = new ObservableArray();

  public isDataLoaded: boolean = false;

  // ========
  // Customer
  // ========
  public customerModalRef: BsModalRef;

  public cboCustomerSub: any;

  public cboCustomerObservableArray: ObservableArray = new ObservableArray();
  public cboCustomerSelectedValue: number;

  public IsLoaded: Boolean = false;
  public listCustomerObservableArray: ObservableArray = new ObservableArray();
  public listCustomerCollectionView: CollectionView = new CollectionView(this.listCustomerObservableArray);
  public listCustomerPageIndex: number = 15;
  @ViewChild('listCustomerFlexGrid') listCustomerFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public selectedCustomer: string = "";

  // ========
  // Customer
  // ========
  public leadModalRef: BsModalRef;

  public cboLeadSub: any;

  public cboLeadObservable: ObservableArray = new ObservableArray();
  public cboLeadObservableArray: ObservableArray = new ObservableArray();
  public cboLeadSelectedValue: number;

  public listLeadObservableArray: ObservableArray = new ObservableArray();
  public listLeadCollectionView: CollectionView = new CollectionView(this.listCustomerObservableArray);
  public listLeadPageIndex: number = 15;
  @ViewChild('listLeadFlexGrid') listLeadFlexGrid: WjFlexGrid;
  public selectedLead: string = "";

  // ========
  // Activity
  // ========
  public listActivitySub: any;
  public saveActivitySub: any;
  public deleteActivitySub: any;

  public isActivityTabHidden: boolean = true;

  public activityModalHeaderTitle: string = "Activity";
  public leadModalHeaderTitle: string = "Lead List";

  public cboListActivityUsersSub: any;
  public cboListActivityUsersObservableArray: ObservableArray = new ObservableArray();

  public cboListActivityStatusSub: any;
  public cboListActivityStatusObservableArray: ObservableArray = new ObservableArray();

  public isActivityLoadingSpinnerHidden: boolean = false;
  public isActivityContentHidden: boolean = true;
  public isActivityNumberHidden = false;

  public isAddClicked: boolean = false;

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
    LDName: "",
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
  private documentEditButtonLabel = "Open";
  private isDocumentEditAuthorized = false;

  ngOnInit() {
    setTimeout(() => {
      if (this.securityService.pageTab("Document")) {
        this.isDocumentEditAuthorized = true;
        this.documentEditButtonLabel = "Edit"
      }
    }, 100);

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
        this.selectedLead = data.LDName;

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

  public listLead(): void {
    this.listLeadObservableArray = new ObservableArray();
    this.listLeadCollectionView = new CollectionView(this.listLeadObservableArray);
    this.listLeadCollectionView.pageSize = 15;
    this.listLeadCollectionView.trackChanges = true;
    this.listLeadCollectionView.refresh();
    // this.listLeadFlexGrid.refresh();

    this.isProgressBarHidden = false;
    this.salesDetailService.listLead();
    this.cboLeadSub = this.salesDetailService.listLeadObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listLeadObservableArray = data;
          this.listLeadCollectionView = new CollectionView(this.listLeadObservableArray);
          this.listLeadCollectionView.pageSize = this.listLeadPageIndex;
          this.listLeadCollectionView.trackChanges = true;
          this.listLeadCollectionView.refresh();
          // this.listLeadFlexGrid.refresh();
        }
        this.isProgressBarHidden = true;
        if (this.cboLeadSub != null) this.cboLeadSub.unsubscribe();
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

  public customerModalHeaderTitle: string = "Customer List";

  public btnCustomerListClick(customerModalTemplate: TemplateRef<any>): void {
    if (!this.isLocked) {
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

  public btnLeadListClick(leadModalTemplate: TemplateRef<any>): void {
    if (!this.isLocked) {
      this.listLead();
      setTimeout(() => {

        this.leadModalRef = this.modalService.show(leadModalTemplate, {
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
    this.salesDeliveryDetailModel.Customer = currentCustomer.Article;

    this.customerModalRef.hide();

    this.createCboSalesInvoice(this.salesDeliveryDetailModel.CustomerId);
  }

  public btnPickLeadClick(): void {
    let currentLead = this.listLeadCollectionView.currentItem;
    this.selectedLead = currentLead.Name;
    this.salesDeliveryDetailModel.LDId = currentLead.Id;
    this.salesDeliveryDetailModel.ContactPerson = currentLead.ContactPerson;
    this.salesDeliveryDetailModel.ContactPosition = currentLead.ContactPosition;
    this.salesDeliveryDetailModel.ContactEmail = currentLead.ContactEmail;
    this.salesDeliveryDetailModel.ContactPhoneNumber = currentLead.ContactPhoneNumber;
    this.salesDeliveryDetailModel.Particulars = currentLead.Remarks;
    this.leadModalRef.hide();
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
          this.toastr.success("Successfully saved.", "Success");

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
          this.toastr.success("Successfully Locked.", "Success");
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
          this.toastr.success("Successfully unlocked.", "Success");

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
    SDNumber: "",
    SDDate: new Date(),
    SDName: "",
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

  // ========
  // Activity
  // ========
  public listActivity(): void {
    if (!this.isDataLoaded) {
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
          }
          setTimeout(() => {
            this.listActivityCollectionView.refresh();
            this.listActivityFlexGrid.refresh();
            this.isDataLoaded = true;
            this.isProgressBarHidden = true;
          }, 300);
          if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
        }
      );
    }
  }

  public totalCost: number = 0;
  public transportationCostTextChanged(): void {
    this.totalCost = this.salesDetailActivityModel.TransportationCost + this.salesDetailActivityModel.OnSiteCost;
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
        SDNumber: this.salesDeliveryDetailModel.SDNumber,
        SDDate: this.salesDeliveryDetailModel.SDDate,
        SDName: this.salesDeliveryDetailModel.Customer,
        ACNumber: "0000000000",
        ACDate: new Date(),
        UserId: 0,
        User: localStorage.getItem("username"),
        FunctionalUserId: this.salesDeliveryDetailModel.AssignedToUserId,
        FunctionalUser: "",
        TechnicalUserId: this.salesDeliveryDetailModel.AssignedToUserId,
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
        SDNumber: this.salesDeliveryDetailModel.SDNumber,
        SDDate: this.salesDeliveryDetailModel.SDDate,
        SDName: this.salesDeliveryDetailModel.Customer,
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
      class: "modal-xl"
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
      class: "modal-xl"
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

    this.salesDetailService.saveActivity(this.salesDetailActivityModel);
    this.saveActivitySub = this.salesDetailService.saveActivityObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully saved.", "Success");

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
    this.salesDetailService.deleteActivity(currentActivity.Id);
    this.deleteActivitySub = this.salesDetailService.deleteActivityObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully deleted.", "Success");

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

  public btnPrintSalesDelivery(): void {
    let id: number = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.caseDetailCaseDialog.open(SalesDetailPrintDialogComponent, {
      width: '1000px',
      data: { objId: id },
      disableClose: true
    });
  }

  public btnPrintSalesDeliveryActivity(): void {
    let currentActivityId: number = 0;
    currentActivityId = this.listActivityCollectionView.currentItem.Id;
    this.activitiyModalRef.hide()

    this.caseDetailCaseDialog.open(SalesDeliveryActivityPrintDialogComponent, {
      width: '1000px',
      data: { objId: currentActivityId },
      disableClose: true
    });
  }

  public listDocumentObservableArray: ObservableArray = new ObservableArray();
  public listDocumentCollectionView: CollectionView = new CollectionView(this.listDocumentObservableArray);
  public listDocumentageIndex: number = 15;
  @ViewChild('listDocumentFlexGrid') listDocumentFlexGrid: WjFlexGrid;
  public isDocumentProgressBarHidden = false;
  public isDocumentDataLoaded: boolean = false;

  public listDocumentSub: any;

  private documentModel: DocumentModel = {
    Id: 0,
    DocumentName: '',
    DocumentType: '',
    DocumentURL: '',
    DocumentGroup: '',
    DateUploaded: new Date(),
    Particulars: '',
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: ''
  }

  public listDocument(): void {
    setTimeout(() => {
      if (!this.isDocumentDataLoaded) {
        this.listDocumentObservableArray = new ObservableArray();
        this.listDocumentCollectionView = new CollectionView(this.listDocumentObservableArray);
        this.listDocumentCollectionView.pageSize = 15;
        this.listDocumentCollectionView.trackChanges = true;
        this.listDocumentCollectionView.refresh();
        this.listDocumentFlexGrid.refresh();

        this.isDocumentProgressBarHidden = true;

        this.documentService.listDocument("Delivery");
        this.listDocumentSub = this.documentService.listDocumentObservable.subscribe(
          data => {
            if (data.length > 0) {
              this.listDocumentObservableArray = data;
              this.listDocumentCollectionView = new CollectionView(this.listDocumentObservableArray);
              this.listDocumentCollectionView.pageSize = this.listDocumentageIndex;
              this.listDocumentCollectionView.trackChanges = true;
            }

            setTimeout(() => {
              this.listDocumentCollectionView.refresh();
              this.listDocumentFlexGrid.refresh();
              this.isDocumentDataLoaded = true;
              this.isDocumentProgressBarHidden = true;
            }, 300);

            console.log('Client', this.listDocumentObservableArray);

            if (this.listDocumentSub != null) this.listDocumentSub.unsubscribe();
          });
      }
    }, 300);
  }

  public btnAddDocument(): void {
    this.isDocumentDataLoaded = false;
    const caseDetailDialogRef = this.caseDetailCaseDialog.open(DocumentComponent, {
      width: '1350px',
      height: '80%',
      data: {
        objDialogTitle: "Add Delivery Document",
        objDialogEvent: "add",
        objDialogGroupDocument: "Delivery",
        objCaseModel: this.documentModel
      },
      disableClose: true
    });

    caseDetailDialogRef.afterClosed().subscribe(result => {
      if (result.data == 200) {
        this.listDocument();
      }
      else {
        this.isDocumentDataLoaded = true;
      }
    });
  }

  public btnEditDocument(): void {
    this.isDocumentDataLoaded = false;

    let currentDocument = this.listDocumentCollectionView.currentItem;
    this.documentModel.Id = currentDocument.Id;
    
    this.documentModel.DocumentName = currentDocument.DocumentName;
    this.documentModel.DocumentType = currentDocument.DocumentType;
    this.documentModel.DocumentURL = currentDocument.DocumentURL;
    this.documentModel.DocumentGroup = currentDocument.DocumentGroup;
    this.documentModel.DateUploaded = currentDocument.DateUploaded;
    this.documentModel.Particulars = currentDocument.Particulars;
    this.documentModel.CreatedByUserId = currentDocument.CreatedByUserId;
    this.documentModel.CreatedByUser = currentDocument.CreatedByUser;
    this.documentModel.CreatedDateTime = currentDocument.CreatedDateTime;
    this.documentModel.UpdatedByUserId = currentDocument.UpdatedByUserId;
    this.documentModel.UpdatedByUser = currentDocument.UpdatedByUser;
    this.documentModel.UpdatedDateTime = currentDocument.UpdatedDateTime;

    const caseDetailDialogRef = this.caseDetailCaseDialog.open(DocumentComponent, {
      width: '1350px',
      height: '80%',
      data: {
        objDialogTitle: "Delivery Document",
        objDialogEvent: "edit",
        objDialogGroupDocument: "Delivery",
        objCaseModel: this.documentModel
      },
      disableClose: true
    });

    caseDetailDialogRef.afterClosed().subscribe(result => {
      if (result.data == 200) {
        console.log('Client', result.data == 200);
        this.listDocument();
        this.clearDataDocumentModel();
      }
      else {
        this.isDocumentDataLoaded = true;
        this.clearDataDocumentModel();
      }
    });
  }

  private clearDataDocumentModel(): void {
    this.documentModel.Id = 0;
    this.documentModel.DocumentName = '';
    this.documentModel.DocumentType = '';
    this.documentModel.DocumentURL = '';
    this.documentModel.DocumentGroup = '';
    this.documentModel.DateUploaded = new Date();
    this.documentModel.Particulars = '';
    this.documentModel.CreatedByUserId = 0;
    this.documentModel.CreatedByUser = '';
    this.documentModel.CreatedDateTime = '';
    this.documentModel.UpdatedByUserId = 0;
    this.documentModel.UpdatedByUser = '';
    this.documentModel.UpdatedDateTime = '';
  }

  public btnDeleteDocument(): void {
    this.isDocumentDataLoaded = false;

    let currentDocument = this.listDocumentCollectionView.currentItem;
    this.documentModel.Id = currentDocument.Id;
    this.documentModel.DocumentName = currentDocument.DocumentName;

    const caseDetailDialogRef = this.caseDetailCaseDialog.open(DocumentDeleteComponent, {
      width: '400px',
      height: '170px',
      data: {
        objDialogTitle: "Delete Delivery Document",
        objDialogEvent: "delete",
        objDialogGroupDocument: "Delivery",
        objCaseModel: this.documentModel
      },
      disableClose: true
    });

    caseDetailDialogRef.afterClosed().subscribe(result => {
      if (result.data == 200) {
        this.listDocument();
        this.clearDataDocumentModel();
      }
      else {
        this.isDocumentDataLoaded = true;
        this.clearDataDocumentModel();
      }
    });
  }


  ngOnDestroy() {
    if (this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
    if (this.cboSalesInvoiceSub != null) this.cboSalesInvoiceSub.unsubscribe();
    if (this.cboProductSub != null) this.cboProductSub.unsubscribe();
    if (this.cboLeadSub != null) this.cboLeadSub.unsubscribe();
    if (this.cboAssignedToUserSub != null) this.cboAssignedToUserSub.unsubscribe();
    if (this.cboSalesStatusSub != null) this.cboSalesStatusSub.unsubscribe();
    if (this.saveSalesSub != null) this.saveSalesSub.unsubscribe();
    if (this.lockSalesSub != null) this.lockSalesSub.unsubscribe();
    if (this.unlockSalesSub != null) this.unlockSalesSub.unsubscribe();
    if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
    if (this.cboListActivityUsersSub != null) this.cboListActivityUsersSub.unsubscribe();
    if (this.cboListActivityStatusSub != null) this.cboListActivityStatusSub.unsubscribe();
    if (this.saveActivitySub != null) this.saveActivitySub.unsubscribe();
    if (this.cboLeadSub != null) this.cboLeadSub.unsubscribe();
  }

}
