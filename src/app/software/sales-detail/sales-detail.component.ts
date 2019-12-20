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

  public activityModalHeaderTitle: string = "";

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

  public listActivitySub: any;
  public saveActivitySub: any;
  public deleteActivitySub: any;

  // public isLoadingSpinnerHidden: boolean = false;
  // public isContentHidden: boolean = true;
  public isActivityTabHidden: boolean = true;

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

            if (this.listActivitySub != null) this.listActivitySub.unsubscribe();
          }
        );
      }, 100);
    }
  }

  ngOnInit() {
    this.createCboProduct();
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
