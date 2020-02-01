import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductService } from './product.service';
import { ProductModel } from './product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.listProductData();
  }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public cboSysFormObservable: ObservableArray = new ObservableArray();

  public listProductObservableArray: ObservableArray = new ObservableArray();
  public listProductCollectionView: CollectionView = new CollectionView(this.listProductObservableArray);
  public listProductPageIndex: number = 15;
  @ViewChild('listProductFlexGrid') listProductFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public addroductSub: any;
  public updateProductSub: any;
  public deleteProductSub: any;


  public productDetailModalRef: BsModalRef;
  public productDeleteModalRef: BsModalRef;
  public isAddClick: boolean = false;
  public productModalTitle: string = "Product";

  public productModel: ProductModel = {
    Id: 0,
    ProductCode: "",
    ProductDescription: "",
    CreatedById: 0,
    CreatedDateTime: new Date(),
    UpdatedById: 0,
    UpdatedDateTime: new Date()
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
    this.listProductPageIndex = selectedValue;

    this.listProductCollectionView.pageSize = this.listProductPageIndex;
    this.listProductCollectionView.refresh();
    this.listProductCollectionView.refresh();
  }

  public listProductData(): void {
    this.listProductObservableArray = new ObservableArray();
    this.listProductCollectionView = new CollectionView(this.listProductObservableArray);
    this.listProductCollectionView.pageSize = 15;
    this.listProductCollectionView.trackChanges = true;
    this.listProductCollectionView.refresh();
    this.listProductFlexGrid.refresh();

    this.isProgressBarHidden = false;

    this.productService.listProduct();
    this.addroductSub = this.productService.listProductObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listProductObservableArray = data;
          this.listProductCollectionView = new CollectionView(this.listProductObservableArray);
          this.listProductCollectionView.pageSize = this.listProductPageIndex;
          this.listProductCollectionView.trackChanges = true;
          this.listProductCollectionView.refresh();
          this.listProductFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.addroductSub != null) this.addroductSub.unsubscribe();
      }
    );
  }

  
  public btnSaveProductClick(): void {
    if (this.isAddClick == true) {
      if (this.productModel.ProductCode !== "" || this.productModel.ProductDescription) {
        this.productService.AddProduct(this.productModel);

        this.addroductSub = this.productService.addProductObservable.subscribe(
          data => {
            if (data[0] == "success") {
              this.productDetailModalRef.hide();
              this.resetProductModel();
              setTimeout(() => {
                this.toastr.success("Product successfully added.", "Success");
                this.isDataLoaded = false;
                this.listProductData();
              }, 100);

            } else if (data[0] == "failed") {
              this.toastr.error(data[1], "Error");
            }
            if (this.addroductSub != null) this.addroductSub.unsubscribe();
          }
        );
      } else {
        this.toastr.error("Please don't leave empty fields.", "Error");
      }
    } else {
      if (this.productModel.ProductCode !== "" || this.productModel.ProductDescription) {
        this.productService.UpdateProduct(this.productModel);

        this.updateProductSub = this.productService.updateProductObservable.subscribe(
          data => {
            if (data[0] == "success") {
              this.productDetailModalRef.hide();
              this.resetProductModel();
              setTimeout(() => {
                this.toastr.success("Updated successfully.", "Success");
                this.isDataLoaded = false;
                this.listProductData();
              }, 100);

            } else if (data[0] == "failed") {
              this.toastr.error(data[1], "Error");
            }
            if (this.updateProductSub != null) this.updateProductSub.unsubscribe();
          }
        );
      } else {
        this.toastr.error("Please don't leave empty fields.", "Error");
      }
    }
  }

  public btnConfirmDeleteDeleteFormClick(): void {
    let currentProduct = this.listProductCollectionView.currentItem;
    this.productService.deleteProduct(currentProduct.Id);
    this.deleteProductSub = this.productService.deleteProductObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.productDeleteModalRef.hide();
          this.toastr.success("Deleted successfully.", "Success");
          setTimeout(() => {
            this.isDataLoaded = false;
            this.listProductData();
          }, 100);

        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
        }
        if (this.deleteProductSub != null) this.deleteProductSub.unsubscribe();
      }
    );
  }

  public btnAddProductClick(addProductDetailModalTemplate: TemplateRef<any>): void {
    this.productDetailModalRef = this.modalService.show(addProductDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg"
    });
    this.isAddClick = true;
  }

  public btnEditProductClick(editProductDetailModalTemplate: TemplateRef<any>): void {
    this.productDetailModalRef = this.modalService.show(editProductDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg"
    });
    this.isAddClick = false;
    let currentProduct = this.listProductCollectionView.currentItem;
    this.productModel.Id = currentProduct.Id;
    this.productModel.ProductCode = currentProduct.ProductCode;
    this.productModel.ProductDescription = currentProduct.ProductDescription;
    this.productModel.CreatedById = currentProduct.CreatedByUserId;
    this.productModel.CreatedDateTime = currentProduct.CreatedDateTime;
    this.productModel.UpdatedById = currentProduct.UpdatedByUserId;
    this.productModel.UpdatedDateTime = currentProduct.UpdatedDateTime;
  }

  public btnDeleteProductClick(delelteProductDetailModalTemplate: TemplateRef<any>): void {
    this.productDeleteModalRef = this.modalService.show(delelteProductDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
    this.isAddClick = true;
  }

  public btnCloseModal(): void {
    this.productDetailModalRef.hide();
    this.resetProductModel();
  }

  public resetProductModel(): void {
    this.productModel.Id = 0;
    this.productModel.ProductCode = "";
    this.productModel.ProductDescription = "";
    this.productModel.CreatedById = 0;
    this.productModel.CreatedDateTime = new Date();
    this.productModel.UpdatedById = 0;
    this.productModel.UpdatedDateTime = new Date();
  }

  ngOnDestroy() {
    if (this.addroductSub != null) this.addroductSub.unsubscribe();
    if (this.addroductSub != null) this.addroductSub.unsubscribe();
    if (this.updateProductSub != null) this.updateProductSub.unsubscribe();
    if (this.deleteProductSub != null) this.deleteProductSub.unsubscribe();
  }
}
