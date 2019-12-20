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

  public listSalesStatusSubject = new Subject<ObservableArray>();
  public listSalesStatusObservable = this.listSalesStatusSubject.asObservable();

  public deleteSalesDeliverySubject = new Subject<string[]>();
  public deleteSalesDeliveryObservable = this.deleteSalesDeliverySubject.asObservable();

  public detailSalesSubject = new Subject<SalesDeliveryDetailModel>();
  public detailSalesObservable = this.detailSalesSubject.asObservable();

  public saveSalesSubject = new Subject<string[]>();
  public saveSalesObservable = this.saveSalesSubject.asObservable();

  public lockSalesSubject = new Subject<string[]>();
  public lockSalesObservable = this.lockSalesSubject.asObservable();
  
  public unlockSalesSubject = new Subject<string[]>();
  public unlockSalesObservable = this.unlockSalesSubject.asObservable();

  public listActivitySubject = new Subject<ObservableArray>();
  public listActivityObservable = this.listActivitySubject.asObservable();

  public listCustomer(): void {
    let listCustomerObservableArray = new ObservableArray();
    this.listCustomerSubject.next(listCustomerObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/customer", this.options).subscribe(
      response => {
        var results = response;
        console.log(results);
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listCustomerObservableArray.push({
              Id: results[i].Id,
              ArticleCode: results[i].ArticleCode,
              Article: results[i].Article,
              ContactPerson: results[i].ContactPerson
            });
          }
        }
        this.listCustomerSubject.next(listCustomerObservableArray);
      }
    );
  }

  public listSalesInvoice(id: number): void {
    let listSalesInvoiceObservableArray = new ObservableArray();
    this.listSalesInvoiceSubject.next(listSalesInvoiceObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/sales/invoice/" + id, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesInvoiceObservableArray.push({
              Id: results[i].Id,
              SINumber: results[i].SINumber
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

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/product", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listProductObservableArray.push({
              Id: results[i].Id,
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

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/lead", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listLeadObservableArray.push({
              Id: results[i].Id,
              LDNumber: results[i].LDNumber,
            });
          }
        }
        this.listLeadSubject.next(listLeadObservableArray);
      }
    );
  }

  public listAssignedUsers(): void {
    let listAssignedToUsersObservableArray = new ObservableArray();
    this.listSalesAssignedToUsersSubject.next(listAssignedToUsersObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/users", this.options).subscribe(
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

  public listSalesStatus(): void {
    let listSalesStatusObservableArray = new ObservableArray();
    this.listSalesStatusSubject.next(listSalesStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/status", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesStatusObservableArray.push({
              Id: results[i].Id,
              Status: results[i].Status
            });
          }
        }
        this.listSalesStatusSubject.next(listSalesStatusObservableArray);
      }
    );
  }

  public detailSales(id: number) {
    let salesDeliveryDetailModel: SalesDeliveryDetailModel;
    this.detailSalesSubject.next(salesDeliveryDetailModel);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/detail/" + id, this.options).subscribe(
      response => {
        var result = response;
        if (result != null) {
          salesDeliveryDetailModel = {
            Id: result["Id"],
            SDNumber: result["SDNumber"],
            SDDate: result["SDDate"],
            RenewalDate: result["RenewalDate"],
            CustomerId: result["CustomerId"],
            Customer: result["Customer"],
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
            CreatedByUser: result["CreatedByUser"],
            CreatedDateTime: result["CreatedDateTime"],
            UpdatedByUserId: result["UpdatedByUserId"],
            UpdatedByUser: result["UpdatedByUser"],
            UpdatedDateTime: result["UpdatedDateTime"],
          };
        }
        this.detailSalesSubject.next(salesDeliveryDetailModel);
      }
    );
  }

  public saveSales(objSales: SalesDeliveryDetailModel) {
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

  public lockSales(objSales: SalesDeliveryDetailModel) {
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

  public unlockSales(objSales: SalesDeliveryDetailModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales//unlock/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.unlockSalesSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.unlockSalesSubject.next(errorResults);
      }
    );
  }

  public deleteSalesDelivery(id: number) {
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

  public listActivity(leadId: number): void {
    let listActivityObservableArray = new ObservableArray();
    this.listActivitySubject.next(listActivityObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/sales/list/" + leadId, this.options).subscribe(
      response => {
        let results = response;

        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            listActivityObservableArray.push({
              Id: results[i].Id,
              ACNumber: results[i].ACNumber,
              ACDate: results[i].ACDate,
              UserId: results[i].UserId,
              User: results[i].User,
              FunctionalUserId: results[i].FunctionalUserId,
              FunctionalUser: results[i].FunctionalUser,
              TechnicalUserId: results[i].TechnicalUserId,
              TechnicalUser: results[i].TechnicalUser,
              CRMStatus: results[i].CRMStatus,
              Activity: results[i].Activity,
              StartDate: results[i].StartDate,
              StartTime: results[i].StartTime,
              EndDate: results[i].EndDate,
              EndTime: results[i].EndTime,
              TransportationCost: results[i].TransportationCost,
              OnSiteCost: results[i].OnSiteCost,
              LDId: results[i].LDId,
              SIId: results[i].SIId,
              SPId: results[i].SPId,
              LastActivity: results[i].LastActivity,
              Status: results[i].Status,
              IsLocked: results[i].IsLocked,
              CreatedByUserId: results[i].CreatedByUserId,
              CreatedByUser: results[i].CreatedByUser,
              CreatedDateTime: results[i].CreatedDateTime,
              UpdatedByUserId: results[i].UpdatedByUserId,
              UpdatedByUser: results[i].UpdatedByUser,
              UpdatedDateTime: results[i].UpdatedDateTime,
            });
          }
        }

        this.listActivitySubject.next(listActivityObservableArray);
      }
    );
  }
}
