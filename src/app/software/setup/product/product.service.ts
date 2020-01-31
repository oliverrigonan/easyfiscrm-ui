import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { ProductModel } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

  public defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  public listProductSubject = new Subject<ObservableArray>();
  public listProductObservable = this.listProductSubject.asObservable();

  public addProductSubject = new Subject<string[]>();
  public addProductObservable = this.addProductSubject.asObservable();

  public updateProductSubject = new Subject<string[]>();
  public updateProductObservable = this.updateProductSubject.asObservable();

  public deleteProductSubject = new Subject<string[]>();
  public deleteProductObservable = this.deleteProductSubject.asObservable();

  public listProduct(): void {
    let productListObservableArray = new ObservableArray();
    this.listProductSubject.next(productListObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "api/crm/mst/product/list", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            productListObservableArray.push({
              Id: results[i].Id,
              Status: results[i].Status,
              Category: results[i].Category,
              IsLocked: results[i].IsLocked,
              CreatedBy: results[i].CreatedBy,
              CreatedDateTime: results[i].CreatedDateTime,
              UpdatedBy: results[i].UpdatedBy,
              UpdatedDateTime: results[i].UpdatedDateTime,
            });
          }
        }
        this.listProductSubject.next(productListObservableArray);
      }
    );
  }

  public AddProduct(): void {
    this.httpClient.post(this.defaultAPIURLHost + "/api/crm/mst/product/add", "", this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", response.toString()];
        this.addProductSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.addProductSubject.next(errorResults);
      }
    );
  }

  public UpdateProduct(objProduct: ProductModel): void {
    this.httpClient.post(this.defaultAPIURLHost + "/api/crm/mst/product/update/" + objProduct.Id, JSON.stringify(objProduct) ,this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", response.toString()];
        this.addProductSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.addProductSubject.next(errorResults);
      }
    );
  }

  public deleteSalesDelivery(id: number) {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/trn/sales/delete" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteProductSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteProductSubject.next(errorResults);
      }
    );
  }
}
