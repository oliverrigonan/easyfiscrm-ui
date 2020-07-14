import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductDetailService } from './product-detail.service';
import { ProductModel } from '../product/product.model';
import { ActivatedRoute } from '@angular/router';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private productDetailService: ProductDetailService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getProductDetail();
  }

  private productSubscription: any;
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
  private saveProductSubscription: any;

  public listSoftwareDevelopmentObservableArray: ObservableArray = new ObservableArray();
  public listSoftwareDevelopmentCollectionView: CollectionView = new CollectionView(this.listSoftwareDevelopmentObservableArray);
  public listProductPageIndex: number = 15;
  @ViewChild('listSoftwareDevelopmentFlexGrid') listSoftwareDevelopmentFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  private async getProductDetail() {
    let id: number = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.productSubscription = await (await this.productDetailService.DetailProduct(id)).subscribe(data => {
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
      if (this.productSubscription != null) this.productSubscription.unsubscribe();
    });

  }

  public async listSoftwareDevelopmentData() {
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
          this.listSoftwareDevelopmentCollectionView.pageSize = this.listProductPageIndex;
          this.listSoftwareDevelopmentCollectionView.trackChanges = true;
          this.listSoftwareDevelopmentCollectionView.refresh();
          this.listSoftwareDevelopmentFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listSoftwareDevelopmentSubscription != null) this.listSoftwareDevelopmentSubscription.unsubscribe();
      }
    );
  }

  public async btnSaveProductClick() {
    let btnAddProduct: Element = document.getElementById("btnAddProduct");
    (<HTMLButtonElement>btnAddProduct).disabled = true;
    this.saveProductSubscription = await (await this.productDetailService.UpdateProduct(this.product, this.product.Id)).subscribe(
      data => {
        let response = data;
        (<HTMLButtonElement>btnAddProduct).disabled = false;
        this.toastr.success("Save successfully.", "Success");

        if (this.saveProductSubscription != null) this.saveProductSubscription.unsubscribe();
      },
      error => {
        (<HTMLButtonElement>btnAddProduct).disabled = false;
        this.toastr.error("Failed", "Error");

        if (this.saveProductSubscription != null) this.saveProductSubscription.unsubscribe();
      }
    );
  }


  ngOnDestroy() {
    if (this.productSubscription != null) this.productSubscription.unsubscribe();
    if (this.listSoftwareDevelopmentSubscription != null) this.listSoftwareDevelopmentSubscription.unsubscribe();
  }

}
