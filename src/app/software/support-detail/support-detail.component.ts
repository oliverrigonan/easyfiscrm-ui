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

  public activityModalHeaderTitle: string = "";
  public customerModalRef: BsModalRef;

  public cboCustomerSub: any;
  public cboCustomerObservableArray: ObservableArray = new ObservableArray();

  public cboAssignedToUserSub: any;
  public cboAssignedToUserObservable: ObservableArray = new ObservableArray();

  public cboSupportStatusSub: any;
  public cboSupportStatusObservable: ObservableArray = new ObservableArray();

  public cboSalesDeliverySub: any;
  public cboSalesDeliveryObservable: ObservableArray = new ObservableArray();

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
        setTimeout(() => {
          this.createCboAssignedToUser();
        }, 100);
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
        

        let btnSaveSupport: Element = document.getElementById("btnSaveSupport");
        let btnLockSupport: Element = document.getElementById("btnLockSupport");
        let btnUnlockSupport: Element = document.getElementById("btnUnlockSupport");

        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;
        this.selectedCustomer = data.Customer;


        (<HTMLButtonElement>btnSaveSupport).disabled = false;
        (<HTMLButtonElement>btnLockSupport).disabled = false;
        (<HTMLButtonElement>btnUnlockSupport).disabled = true;

        if (data.IsLocked) {
          this.isLocked = true;

          (<HTMLButtonElement>btnSaveSupport).disabled = true;
          (<HTMLButtonElement>btnLockSupport).disabled = true;
          (<HTMLButtonElement>btnUnlockSupport).disabled = false;

          // this.isActivityTabHidden = false;
        }
        // setTimeout(() => {
        //   this.createCboSalesInvoice(this.salesDeliveryDetailModel.CustomerId);
        // }, 100);
        // this.isLoadingSpinnerHidden = true;
        // this.isContentHidden = false;

        if (this.detailSupportSub != null) this.detailSupportSub.unsubscribe();
      }
    );
  }
}
