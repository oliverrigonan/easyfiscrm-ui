import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { ProductModel } from '../product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

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

  public async DetailProduct(productId: number) {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/product/detail/" + productId, this.options);
  }
  
  public async UpdateProduct(objProduct: ProductModel, productId: number){
    return await this.httpClient.put(this.defaultAPIURLHost + "/api/crm/product/update/" + productId, JSON.stringify(objProduct) ,this.options);
  }

  public async ListSoftwareDevelopment(productId: number){
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/software/development/list/" + productId, this.options);
  }
}
