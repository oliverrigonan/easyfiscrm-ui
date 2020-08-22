import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ProductDetailService } from './product-detail.service';
import { ProductModel } from '../product/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { ToastrService } from 'ngx-toastr';
import { SoftwareDevelopentModel } from './software-development.model';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private productDetailService: ProductDetailService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private securityService: SecurityService

  ) { }

  private crmAdmin: boolean = false;
  private currentSoftwareDevelopementId: number = 0;

  ngOnInit() {
    if (this.securityService.openGroupPage("Admin") == true) {
      this.crmAdmin = true;
    }
    this.getProductDetail();
  }

  private productDetailSubscription: any;
  private saveProductSubscription: any;

  private product: ProductModel = {
    Id: 0,
    ProductCode: '',
    ProductDescription: '',
    CreatedById: 0,
    CreatedByUser: '',
    CreatedDateTime: new Date(),
    UpdatedById: 0,
    UpdatedByUser: '',
    UpdatedDateTime: new Date()
  };

  private listSoftwareDevelopmentSubscription: any;
  private addSoftwareDelopmentSubcription: any;
  private saveSoftwareDevelopementSubscription: any;
  private saveSoftwareDevelopmentSubscription: any;

  private deleteSoftwareDelopmentSubcription: any;


  private activeTab = 'softwareDevelopmentList';

  private listSoftwareDevelopmentObservableArray: ObservableArray = new ObservableArray();
  private listSoftwareDevelopmentCollectionView: CollectionView = new CollectionView(this.listSoftwareDevelopmentObservableArray);
  private listSoftwareDevelopmentPageIndex: number = 10;
  @ViewChild('listSoftwareDevelopmentFlexGrid') listSoftwareDevelopmentFlexGrid: WjFlexGrid;
  private isProgressBarHidden = false;
  private isDataLoaded: boolean = false;

  private softwareDevelopmentDeleteModalRef: BsModalRef;

  private softwareDevelopentModel: SoftwareDevelopentModel = {
    Id: 0,
    SDNumber: '',
    SDDate: '',
    ProductId: 0,
    ProductDescription: '',
    Issue: '',
    IssueType: '',
    Remarks: '',
    AssignedToUserId: 0,
    AssignedToUserFullname: '',
    TargetDateTime: new Date(),
    CloseDateTime: new Date(),
    Status: '',
    IsLocked: '',
    CreatedByUserId: 0,
    CreatedByUserFullname: '',
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedByUserFullname: '',
    UpdatedDateTime: new Date()
  }

  private isLocked: boolean = false;
  private isActivityTabHidden: boolean = false;

  private lockSoftwareDevelopmentSubscription: any;
  private unlockSoftwareDevelopmentSubscription: any;

  private softwareDevelopmentDetailSubscription: any;

  private cboIssueTypeSubscription: any;
  private cboIssueTypeObservableArray: ObservableArray = new ObservableArray();

  private cboProductSubscription: any;
  private cboProductObservableArray: ObservableArray = new ObservableArray();

  private cboAssignedUserSubscription: any;
  private cboAssignedUserObservableArray: ObservableArray = new ObservableArray();

  private cboStatusSubscription: any;
  private cboStatusObservableArray: ObservableArray = new ObservableArray();

  private isSoftwareDevelopmentTabHidden: boolean = true;

  private async getProductDetail() {
    let id: number = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });
    this.productDetailSubscription = await (await this.productDetailService.DetailProduct(id)).subscribe(data => {
      var results = data;
      if (results != null) {
        this.product.Id = results["Id"];
        this.product.ProductCode = results["ProductCode"];
        this.product.ProductDescription = results["ProductDescription"];
        this.product.CreatedById = results["CreatedById"];
        this.product.CreatedByUser = results["CreatedByUser"];
        this.product.CreatedDateTime = results["CreatedDateTime"];
        this.product.UpdatedById = results["UpdatedById"];
        this.product.UpdatedByUser = results["UpdatedByUser"];
        this.product.UpdatedDateTime = results["UpdatedDateTime"];
      }

      this.listSoftwareDevelopmentData();
      if (this.productDetailSubscription != null) this.productDetailSubscription.unsubscribe();
    });
  }

  private async listSoftwareDevelopmentData() {
    this.listSoftwareDevelopmentObservableArray = new ObservableArray();
    this.listSoftwareDevelopmentCollectionView = new CollectionView(this.listSoftwareDevelopmentObservableArray);
    this.listSoftwareDevelopmentCollectionView.pageSize = 15;
    this.listSoftwareDevelopmentCollectionView.trackChanges = true;
    this.listSoftwareDevelopmentCollectionView.refresh();
    this.listSoftwareDevelopmentFlexGrid.refresh();

    this.isProgressBarHidden = false;

    this.listSoftwareDevelopmentSubscription = await (await this.productDetailService.ListSoftwareDevelopment(this.product.Id)).subscribe(
      data => {
        let results = data;
        let productListObservableArray = new ObservableArray();
        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            productListObservableArray.push({
              Id: results[i].Id,
              SDNumber: results[i].SDNumber,
              SDDate: results[i].SDDate,
              ProductId: results[i].ProductId,
              ProductDescription: results[i].ProductDescription,
              Issue: results[i].Issue,
              IssueType: results[i].IssueType,
              Remarks: results[i].Remarks,
              AssignedToUserId: results[i].AssignedToUserId,
              AssignedToUserFullname: results[i].AssignedToUserFullname,
              TargetDateTime: results[i].TargetDateTime,
              CloseDateTime: results[i].CloseDateTime,
              Status: results[i].Status,
              IsLocked: results[i].IsLocked,
              CreatedByUserId: results[i].CreatedByUserId,
              CreatedByUserFullname: results[i].CreatedByUserFullname,
              CreatedDateTime: results[i].CreatedDateTime,
              UpdatedByUserId: results[i].UpdatedByUserId,
              UpdatedByUserFullname: results[i].UpdatedByUserFullname,
              UpdatedDateTime: results[i].UpdatedDateTime,
            });
          }

          this.listSoftwareDevelopmentObservableArray = productListObservableArray;
          this.listSoftwareDevelopmentCollectionView = new CollectionView(this.listSoftwareDevelopmentObservableArray);
          this.listSoftwareDevelopmentCollectionView.pageSize = this.listSoftwareDevelopmentPageIndex;
          this.listSoftwareDevelopmentCollectionView.trackChanges = true;
          this.listSoftwareDevelopmentCollectionView.refresh();
          this.listSoftwareDevelopmentFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listSoftwareDevelopmentSubscription != null) this.listSoftwareDevelopmentSubscription.unsubscribe();
      },
      error => {
        this.toastr.error(error.status, "Error");
      }
    );
  }

  private async btnSaveProductClick() {
    let btnSaveProduct: Element = document.getElementById("btnSaveProduct");
    (<HTMLButtonElement>btnSaveProduct).disabled = true;
    this.saveProductSubscription = await (await this.productDetailService.UpdateProduct(this.product, this.product.Id)).subscribe(
      data => {
        let response = data;
        (<HTMLButtonElement>btnSaveProduct).disabled = false;
        this.toastr.success("Save successfully.", "Success");

        if (this.saveProductSubscription != null) this.saveProductSubscription.unsubscribe();
      },
      error => {
        (<HTMLButtonElement>btnSaveProduct).disabled = false;
        this.toastr.error("Failed", "Error");

        if (this.saveProductSubscription != null) this.saveProductSubscription.unsubscribe();
      }
    );
  }

  private softwareDevelopenetEvent = 'add';

  async btnEditSoftwareDevelopmentDetailClick() {
    this.addEditPogressBarHidden = false;
    this.progressPercentage = '20%';

    this.softwareDevelopenetEvent = "edit"
    this.currentSoftwareDevelopementId = this.listSoftwareDevelopmentCollectionView.currentItem.Id;
    await this.createCboIssueType();
  }

  private async createCboIssueType() {
    this.cboIssueTypeSubscription = await (await this.productDetailService.ListIssueType()).subscribe(
      data => {
        let issueTypeObservableArray = new ObservableArray();
        if (data["length"] > 0) {
          for (var i = 0; i <= data["length"] - 1; ++i) {
            issueTypeObservableArray.push({
              IssueType: data[i].IssueType,
            });
          }
        }

        this.cboIssueTypeObservableArray = issueTypeObservableArray;
        this.createCboAssignedUser();
        this.progressPercentage = '35%';
        if (this.cboIssueTypeSubscription != null) this.cboIssueTypeSubscription.unsubscribe();
      }
    );
  }

  private async createCboProduct() {
    this.cboProductSubscription = await (await this.productDetailService.ListProduct()).subscribe(
      data => {
        let productObservableArray = new ObservableArray();
        if (data["length"] > 0) {
          for (var i = 0; i <= data["length"] - 1; ++i) {
            productObservableArray.push({
              Id: data[i].Id,
              ProductDescription: data[i].ProductDescription
            });
          }
        }

        this.cboProductObservableArray = productObservableArray;
        this.progressPercentage = '40%';

        if (this.cboProductSubscription != null) this.cboProductSubscription.unsubscribe();
      }
    );
  }

  private async createCboAssignedUser() {
    this.cboAssignedUserSubscription = await (await this.productDetailService.ListAssignedUser()).subscribe(
      data => {
        let assignedUserObservableArray = new ObservableArray();
        if (data["length"] > 0) {
          for (var i = 0; i <= data["length"] - 1; ++i) {
            assignedUserObservableArray.push({
              Id: data[i].Id,
              FullName: data[i].FullName
            });
          }
        }

        this.cboAssignedUserObservableArray = assignedUserObservableArray;
        this.progressPercentage = '55%';
        this.createCboStatus();
        if (this.cboAssignedUserSubscription != null) this.cboAssignedUserSubscription.unsubscribe();
      }
    );
  }

  private async createCboStatus() {
    this.cboStatusSubscription = await (await this.productDetailService.ListStatus()).subscribe(
      data => {
        let statusObservableArray = new ObservableArray();
        if (data["length"] > 0) {
          for (var i = 0; i <= data["length"] - 1; ++i) {
            statusObservableArray.push({
              Id: data[i].Id,
              Status: data[i].Status
            });
          }
        }

        this.cboStatusObservableArray = statusObservableArray;
        this.progressPercentage = '100%';
        this.getSoftwareDevelopmentDetail();
        if (this.cboStatusSubscription != null) this.cboStatusSubscription.unsubscribe();
      }
    );
  }

  private async getSoftwareDevelopmentDetail() {
    this.softwareDevelopmentDetailSubscription = await (await this.productDetailService.DetailSoftwareDevelopmentDetail(this.currentSoftwareDevelopementId)).subscribe(data => {
      var results = data;
      if (results != null) {
        this.softwareDevelopentModel.Id = results["Id"];
        this.softwareDevelopentModel.SDNumber = results["SDNumber"];
        this.softwareDevelopentModel.SDDate = results["SDDate"];
        this.softwareDevelopentModel.ProductId = results["ProductId"];
        this.softwareDevelopentModel.ProductDescription = results["ProductDescription"];
        this.softwareDevelopentModel.Issue = results["Issue"];
        this.softwareDevelopentModel.IssueType = results["IssueType"];
        this.softwareDevelopentModel.Remarks = results["Remarks"];
        this.softwareDevelopentModel.AssignedToUserId = results["AssignedToUserId"];
        this.softwareDevelopentModel.AssignedToUserFullname = results["AssignedToUserFullname"];
        this.softwareDevelopentModel.TargetDateTime = results["TargetDateTime"];
        this.softwareDevelopentModel.CloseDateTime = results["CloseDateTime"];
        this.softwareDevelopentModel.Status = results["Status"];
        this.softwareDevelopentModel.IsLocked = results["IsLocked"];

        let btnSaveSoftwareDevelopmentDetail: Element = document.getElementById("btnSaveSoftwareDevelopmentDetail");
        let btnLockSoftwareDevelopmentDetail: Element = document.getElementById("btnLockSoftwareDevelopmentDetail");
        let btnUnlockSoftwareDevelopmentDetail: Element = document.getElementById("btnUnlockSoftwareDevelopmentDetail");
        (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = true;
        this.isLocked = results["IsLocked"];

        if (this.softwareDevelopentModel.IsLocked) {
          this.isLocked = true;
          (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = true;
          (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = true;
          (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = false;
        }


        this.isSoftwareDevelopmentTabHidden = false;
        this.isSoftwareDevelopmentPanelDisplay = 'inline';

        setTimeout(() => {
          this.addEditPogressBarHidden = true;
        }, 100);

        this.activeTab = "softwareDevelopmentDetail";
        if (this.softwareDevelopenetEvent == 'add') {
          this.listSoftwareDevelopmentData();
        }
      }

      if (this.softwareDevelopmentDetailSubscription != null) this.softwareDevelopmentDetailSubscription.unsubscribe();
    });
  }

  private async btnAddSoftwareDevelopemtClick() {
    this.softwareDevelopenetEvent = 'add';
    this.addEditPogressBarHidden = false;
    this.progressPercentage = '20%';
    let btnAddSoftwareDevelopment: Element = document.getElementById("btnAddSoftwareDevelopment");
    (<HTMLButtonElement>btnAddSoftwareDevelopment).disabled = true;
    this.addSoftwareDelopmentSubcription = await (await this.productDetailService.AddSoftwareDevelopment(this.product.Id)).subscribe(
      (data: any) => {
        (<HTMLButtonElement>btnAddSoftwareDevelopment).disabled = false;
        this.toastr.success("Save successfully.", "Success");
        this.currentSoftwareDevelopementId = data;
        this.createCboIssueType();

        if (this.addSoftwareDelopmentSubcription != null) this.addSoftwareDelopmentSubcription.unsubscribe();
      },
      error => {
        (<HTMLButtonElement>btnAddSoftwareDevelopment).disabled = false;
        this.toastr.error("Failed", "Error");

        if (this.addSoftwareDelopmentSubcription != null) this.addSoftwareDelopmentSubcription.unsubscribe();
      }
    );
  }

  async btnSoftwareDevelopmentListClick(activeTab) {
    this.activeTab = await activeTab;
    this.isSoftwareDevelopmentPanelDisplay = 'none';

    setTimeout(() => {
      this.listSoftwareDevelopmentCollectionView.refresh();
      this.listSoftwareDevelopmentFlexGrid.refresh();
    });
  }

  private async btnSaveSoftwareDevelopmentDetailClick() {
    let btnSaveSoftwareDevelopmentDetail: Element = document.getElementById("btnSaveSoftwareDevelopmentDetail");
    let btnLockSoftwareDevelopmentDetail: Element = document.getElementById("btnLockSoftwareDevelopmentDetail");
    let btnUnlockSoftwareDevelopmentDetail: Element = document.getElementById("btnUnlockSoftwareDevelopmentDetail");
    (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = true;
    (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = true;
    (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = true;

    this.saveSoftwareDevelopementSubscription = await (await this.productDetailService.SaveSoftwareDevelopment(this.softwareDevelopentModel, this.softwareDevelopentModel.Id)).subscribe(
      data => {
        (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = false;
        this.toastr.success("Save successfully.", "Success");
        this.listSoftwareDevelopmentData();

        if (this.saveSoftwareDevelopementSubscription != null) this.saveSoftwareDevelopementSubscription.unsubscribe();
      },
      error => {
        (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = false;
        this.toastr.error("Failed", "Error");

        if (this.saveSoftwareDevelopementSubscription != null) this.saveSoftwareDevelopementSubscription.unsubscribe();
      }
    );
  }

  private progressPercentage: any;
  private addEditPogressBarHidden: boolean = true;

  private async btnLockSoftwareDevelopmentDetailClick() {
    let btnSaveSoftwareDevelopmentDetail: Element = document.getElementById("btnSaveSoftwareDevelopmentDetail");
    let btnLockSoftwareDevelopmentDetail: Element = document.getElementById("btnLockSoftwareDevelopmentDetail");
    let btnUnlockSoftwareDevelopmentDetail: Element = document.getElementById("btnUnlockSoftwareDevelopmentDetail");
    (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = true;
    (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = true;
    (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = true;

    this.lockSoftwareDevelopmentSubscription = await (await this.productDetailService.LockSoftwareDevelopment(this.softwareDevelopentModel, this.softwareDevelopentModel.Id)).subscribe(
      data => {
        (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = true;
        (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = true;
        (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = false;
        this.toastr.success("Successfully saved.", "Success");
        this.isLocked = true;
        this.listSoftwareDevelopmentData();

        if (this.lockSoftwareDevelopmentSubscription != null) this.lockSoftwareDevelopmentSubscription.unsubscribe();
      },
      error => {
        (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = true;
        this.toastr.error("Failed", "Error");

        if (this.lockSoftwareDevelopmentSubscription != null) this.lockSoftwareDevelopmentSubscription.unsubscribe();
      }
    );
  }

  private async btnUnlockSoftwareDevelopmentDetailClick() {
    let btnSaveSoftwareDevelopmentDetail: Element = document.getElementById("btnSaveSoftwareDevelopmentDetail");
    let btnLockSoftwareDevelopmentDetail: Element = document.getElementById("btnLockSoftwareDevelopmentDetail");
    let btnUnlockSoftwareDevelopmentDetail: Element = document.getElementById("btnUnlockSoftwareDevelopmentDetail");
    (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = true;
    (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = true;
    (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = true;

    this.unlockSoftwareDevelopmentSubscription = await (await this.productDetailService.UnlockSoftwareDevelopment(this.softwareDevelopentModel.Id)).subscribe(
      data => {
        (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = false;
        (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = true;
        this.toastr.success("Successfully saved.", "Success");
        this.isLocked = false;

        this.listSoftwareDevelopmentData();

        if (this.unlockSoftwareDevelopmentSubscription != null) this.unlockSoftwareDevelopmentSubscription.unsubscribe();
      },
      error => {
        (<HTMLButtonElement>btnSaveSoftwareDevelopmentDetail).disabled = true;
        (<HTMLButtonElement>btnLockSoftwareDevelopmentDetail).disabled = true;
        (<HTMLButtonElement>btnUnlockSoftwareDevelopmentDetail).disabled = false;
        this.toastr.error("Failed", "Error");

        if (this.unlockSoftwareDevelopmentSubscription != null) this.unlockSoftwareDevelopmentSubscription.unsubscribe();
      }
    );
  }

  private isSoftwareDevelopmentPanelDisplay: string = 'none';

  btnSoftwareDevelopmentDetailClick(activeTab) {
    this.activeTab = activeTab;
    this.isSoftwareDevelopmentPanelDisplay = 'inline';
  }

  private async btnCloseSoftwareDevelopmentDetailClick() {
    await this.btnSoftwareDevelopmentListClick('softwareDevelopmentList');
    this.isSoftwareDevelopmentPanelDisplay = 'none';
    this.isSoftwareDevelopmentTabHidden = true;
  }

  private btnDeleteSoftwareDevelopmentClick(delelteProductDetailModalTemplate: TemplateRef<any>): void {
    this.softwareDevelopmentDeleteModalRef = this.modalService.show(delelteProductDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
  }

  private async btnConfirmDeleteDeleteFormClick() {
    let currentSoftwareDevelopment = this.listSoftwareDevelopmentCollectionView.currentItem;
    this.deleteSoftwareDelopmentSubcription = await (await this.productDetailService.DeleteSoftwareDevelopment(currentSoftwareDevelopment.Id)).subscribe(
      data => {
        this.toastr.success("Deleted successfully.", "Success");
        this.softwareDevelopmentDeleteModalRef.hide();
        this.isDataLoaded = false;
        this.listSoftwareDevelopmentData();
        if (this.deleteSoftwareDelopmentSubcription != null) this.deleteSoftwareDelopmentSubcription.unsubscribe();
      },
      error => {
        this.toastr.error(error["error"], "Error");
        if (this.deleteSoftwareDelopmentSubcription != null) this.deleteSoftwareDelopmentSubcription.unsubscribe();

      }
    );
  }

  ngOnDestroy() {
    if (this.productDetailSubscription != null) this.productDetailSubscription.unsubscribe();
    if (this.saveProductSubscription != null) this.saveProductSubscription.unsubscribe();

    if (this.listSoftwareDevelopmentSubscription != null) this.listSoftwareDevelopmentSubscription.unsubscribe();
    if (this.addSoftwareDelopmentSubcription != null) this.addSoftwareDelopmentSubcription.unsubscribe();
    if (this.deleteSoftwareDelopmentSubcription != null) this.deleteSoftwareDelopmentSubcription.unsubscribe();
  }

}
