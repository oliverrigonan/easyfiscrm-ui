import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductModel } from '../product/product.model';
import { SoftwareDevelopentModel } from './software-development.model';

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

  public async UpdateProduct(objProduct: ProductModel, productId: number) {
    return await this.httpClient.put(this.defaultAPIURLHost + "/api/crm/product/update/" + productId, JSON.stringify(objProduct), this.options);
  }

  public async DetailSoftwareDevelopmentDetail(softwareDevelopmentId: number) {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/software/development/detail/" + softwareDevelopmentId, this.options);
  }

  public async ListIssueType() {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/software/development/list/issue/type/", this.options);
  }

  public async ListProduct() {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/software/development/list/product/", this.options);
  }

  public async ListAssignedUser() {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/software/development/list/users/", this.options);
  }

  public async ListStatus() {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/software/development/list/status/", this.options);
  }

  public async ListSoftwareDevelopment(productId: number) {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/software/development/list/" + productId, this.options);
  }

  public async AddSoftwareDevelopment(productId: number) {
    return await this.httpClient.post(this.defaultAPIURLHost + "/api/crm/trn/software/development/add/" + productId, "", this.options);
  }

  public async SaveSoftwareDevelopment(objSoftwareDevelopent: SoftwareDevelopentModel, softwareDevelomentId: number) {
    return await this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/software/development/update/" + softwareDevelomentId, JSON.stringify(objSoftwareDevelopent), this.options);
  }
  public async LockSoftwareDevelopment(objSoftwareDevelopent: SoftwareDevelopentModel, softwareDevelomentId: number) {
    return await this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/software/development/lock/" + softwareDevelomentId, JSON.stringify(objSoftwareDevelopent), this.options);
  }

  public async UnlockSoftwareDevelopment(softwareDevelomentId: number) {
    return await this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/software/development/unlock/" + softwareDevelomentId, "", this.options);
  }

  public async DeleteSoftwareDevelopment(softwareDevelomentId: number) {
    console.log(softwareDevelomentId);

    return await this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/trn/software/development/delete/" + softwareDevelomentId, this.options);
  }
}
