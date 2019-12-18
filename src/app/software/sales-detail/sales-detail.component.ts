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
  public isActivityTabHidden: boolean = true;

  public detailSalesSub: any;
  public saveSalesSub: any;
  public lockSalesSub: any;
  public unlockSalesSub: any;

  public isLocked: boolean = false;

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

  public salesDeliveryDetailModel: SalesDeliveryDetailModel = {
    Id: 0,
    SDNumber: "",
    SDDate: new Date(),
    RenewalDate: new Date(),
    CustomerId: 0,
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
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedDateTime: new Date(),
  }

  ngOnInit() {
    this.createCboCustomer();
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
        this.salesDeliveryDetailModel.CreatedDateTime = data.CreatedDateTime;
        this.salesDeliveryDetailModel.UpdatedByUserId = data.UpdatedByUserId;
        this.salesDeliveryDetailModel.UpdatedDateTime = data.UpdatedDateTime;

        let btnSaveSales: Element = document.getElementById("btnSaveLead");
        let btnLockSales: Element = document.getElementById("btnLockLead");
        let btnUnlockSales: Element = document.getElementById("btnUnlockLead");

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

        this.isLoadingSpinnerHidden = true;
        this.isContentHidden = false;

        if(this.detailSalesSub != null) this.detailSalesSub.unsubscribe();
      }
    );
  }
  public createCboCustomer(): void {
    this.salesDetailService.listCustomer();
    this.cboCustomerSub = this.salesDetailService.listCustomerObservable.subscribe(
      data => {
        let customerObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            customerObservableArray.push({
              Id: data[i].Id,
              Article: data[i].Article
            });
          }
        }

        this.cboCustomerObservableArray = customerObservableArray;
        if (this.cboCustomerObservableArray.length > 0) {
          setTimeout(() => {
            this.createCboSalesInvoice();
          }, 100);
        }
        if(this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
      }
    );
  }

  public createCboSalesInvoice(): void {
    this.salesDetailService.listSalesInvoice(this.cboCustomerSelectedValue);
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

        this.isDataLoaded = true;
        if(this.cboSalesInvoiceObservableArray.length > 0){
          setTimeout(() => {
            this.createCboProduct();
          }, 100);
        }
        
        if(this.cboSalesInvoiceSub != null) this.cboSalesInvoiceSub.unsubscribe();
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

        if(this.cboProductObservableArray.length > 0){
          setTimeout(()=>{
            this.createCboLead();
          },100);
        }
        if(this.cboProductSub != null) this.cboProductSub.unsubscribe();
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

        if(this.cboLeadObservable.length > 0){
          setTimeout(()=>{
            this.createCboAssignedToUser();
          },100);
        }
        if(this.cboLeadSub != null) this.cboLeadSub.unsubscribe();
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

        if(this.cboAssignedToUserObservable.length > 0){
          setTimeout(()=>{
            this.createCboSalesStatus();
          },100);
        }
        if(this.cboAssignedToUserSub != null) this.cboAssignedToUserSub.unsubscribe();
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
        
        if(this.cboSalesStatusObservable.length > 0){
          setTimeout(()=>{
            this.detailSales();
          },100);
        }
        if(this.cboSalesStatusSub != null) this.cboSalesStatusSub.unsubscribe();
      }
    );
  }

  public cboCustomerSelectedIndexChanged(selectedValue: any): void {
    this.cboCustomerSelectedValue = selectedValue;

    if (this.isDataLoaded) {
      setTimeout(() => {
        this.createCboSalesInvoice();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.cboProductSub != null) this.cboProductSub.unsubscribe();
    if (this.cboSalesInvoiceSub != null) this.cboSalesInvoiceSub.unsubscribe();
    if (this.cboCustomerSub != null) this.cboCustomerSub.unsubscribe();
    if(this.cboProductSub != null) this.cboProductSub.unsubscribe();
    if(this.cboLeadSub != null) this.cboLeadSub.unsubscribe();
    if(this.detailSalesSub != null) this.detailSalesSub.unsubscribe();
  }

}
