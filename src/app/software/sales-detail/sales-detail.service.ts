import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { SalesDeliveryDetailModel } from './sales-detail.model';

@Injectable({
  providedIn: 'root'
})
export class SalesDetailService {

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

  public listCustomerSubject = new Subject<ObservableArray>();
  public listCustomerObservable = this.listCustomerSubject.asObservable();

  public listSalesInvoiceSubject = new Subject<ObservableArray>();
  public listSalesInvoiceObservable = this.listSalesInvoiceSubject.asObservable();

  public listProductSubject = new Subject<ObservableArray>();
  public listProductObservable = this.listProductSubject.asObservable();

  public listLeadSubject = new Subject<ObservableArray>();
  public listLeadObservable = this.listLeadSubject.asObservable();

  public listSalesAssignedToUsersSubject = new Subject<ObservableArray>();
  public listLeadAssignedToUsersObservable = this.listSalesAssignedToUsersSubject.asObservable();

  public deleteSalesDeliverySubject = new Subject<string[]>();
  public deleteSalesDeliveryObservable = this.deleteSalesDeliverySubject.asObservable();

  public detailSalesSubject = new Subject<SalesDetailModel>();
  public detailSalesObservable = this.detailSalesSubject.asObservable();
  public saveSalesSubject = new Subject<string[]>();
  public saveSalesObservable = this.saveSalesSubject.asObservable();
  public lockSalesSubject = new Subject<string[]>();
  public lockSalesObservable = this.lockSalesSubject.asObservable();
  public unlockSalesSubject = new Subject<string[]>();
  public unlockSalesObservable = this.unlockSalesSubject.asObservable();

  public listCustomer(): void {
    let listCustomerObservableArray = new ObservableArray();
    this.listCustomerSubject.next(listCustomerObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/customer", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listCustomerObservableArray.push({
              Id: results[i].Id,
              Article: results[i].Id
            });
          }
        }

        this.listCustomerSubject.next(listCustomerObservableArray);
      }
    );
  }

  public listSalesInvoice(): void {
    let listSalesInvoiceObservableArray = new ObservableArray();
    this.listSalesInvoiceSubject.next(listSalesInvoiceObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/sales/invoice", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for(var i = 0; i <= results["length"] - 1; i++){
            listSalesInvoiceObservableArray.push({
              Id: results[i].Id,
              SDNumber: results[i].SDNumber
            });
          }
        }
        this.listSalesInvoiceSubject.next(listSalesInvoiceObservableArray);
      }
    );
  }

  public listProduct(): void {
    let listProductObservableArray = new ObservableArray();
    this.listProductSubject.next(listProductObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/product", this.options).subscribe(
      response => {
        var results = response;
        if(results["lenght"] > 0){
          for(var i = 0; i <= results["length"] - 1; i++){
            listProductObservableArray.push({
              Id: results[i].Id,
              ProductCode: results[i].ProductCode,
              ProductDescription: results[i].ProductDescription
            });
          }
        }
        this.listProductSubject.next(listProductObservableArray);
      }
    );
  }

  public listLead(): void {
    let listLeadObservableArray = new ObservableArray();
    this.listLeadSubject.next(listLeadObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/lead", this.options).subscribe(
      response => {
        var results = response;
        if(results["lenght"] > 0){
          for(var i = 0; i <= results["length"] - 1; i++){
            listLeadObservableArray.push({
              Id: results[i].Id,
              LDNumber: results[i].LDNumber,
            });
          }
        }
        this.listProductSubject.next(listLeadObservableArray);
      }
    );
  }

  public listAssignedUsers(): void {
    let listAssignedToUsersObservableArray = new ObservableArray();
    this.listSalesAssignedToUsersSubject.next(listAssignedToUsersObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/users", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listAssignedToUsersObservableArray.push({
              Id: results[i].Id,
              UserName: results[i].UserName,
              FullName: results[i].FullName
            });
          }
        }

        this.listSalesAssignedToUsersSubject.next(listAssignedToUsersObservableArray);
      }
    );
  }

  public detailSales(id: number) {
    let salesDetailModel: SalesDeliveryDetailModel;
    this.detailSalesSubject.next(salesDetailModel);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/detail/" + id, this.options).subscribe(
      response => {
        var result = response;
        if (result != null) {
          salesDetailModel = {
            Id: result["Id"],
            SDNumber: result["SDNumber"],
            SDDate: result["SDDate"],
            RenewalDate: result["RenewalDate"],
            CustomerId: result["CustomerId"],
            SIId: result["SIId"],
            ProductId: result["ProductId"],
            LDId: result["LDId"],
            ContactPerson: result["ContactPerson"],
            ContactPosition: result["ContactPosition"],
            ContactEmail: result["ContactEmail"],
            ContactPhoneNumber: result["ContactPhoneNumber"],
            Particulars: result["Particulars"],
            AssignedToUserId: result["AssignedToUserId"],
            Status: result["Status"],
            IsLocked: result["IsLocked"],
            CreatedByUserId: result["CreatedByUserId"],
            CreatedDateTime: result["CreatedDateTime"],
            UpdatedByUserId: result["UpdatedByUserId"],
            UpdatedDateTime: result["UpdatedDateTime"],
          };
        }
        this.detailSalesSubject.next(salesDetailModel);
      }
    );
  }

  public saveSales(objSales: SalesDetailModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales/save/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveSalesSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.saveSalesSubject.next(errorResults);
      }
    );
  }

  public lockSales(objSales: SalesDetailModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales/lock/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.lockSalesSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.lockSalesSubject.next(errorResults);
      }
    );
  }

  public deleteSalesDelivery(id: number){
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/trn/sales/delete" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteSalesDeliverySubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteSalesDeliverySubject.next(errorResults);
      }
    );
  }
}
