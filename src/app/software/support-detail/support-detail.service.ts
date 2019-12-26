import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { SupportModel } from '../support-list/support-list.model';

@Injectable({
  providedIn: 'root'
})
export class SupportDetailService {

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

  public listCustomerSubject = new Subject<ObservableArray>();
  public listCustomerObservable = this.listCustomerSubject.asObservable();

  public listSalesDeliverySubject = new Subject<ObservableArray>();
  public listSalesDeliveryObservable = this.listSalesDeliverySubject.asObservable();

  public listSupportAssignedToUsersSubject = new Subject<ObservableArray>();
  public listLeadAssignedToUsersObservable = this.listSupportAssignedToUsersSubject.asObservable();

  public listSupportStatusSubject = new Subject<ObservableArray>();
  public listSupportStatusObservable = this.listSupportStatusSubject.asObservable();

  public defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  public detailSupportSubject = new Subject<SupportModel>();
  public detailSupportObservable = this.detailSupportSubject.asObservable();

  public saveSupportSubject = new Subject<string[]>();
  public saveSupportObservable = this.saveSupportSubject.asObservable();
  
  public lockSupportSubject = new Subject<string[]>();
  public lockSupportObservable = this.lockSupportSubject.asObservable();

  public unlockSupportSubject = new Subject<string[]>();
  public unlockSupportObservable = this.unlockSupportSubject.asObservable();

  public listCustomer(): void {
    let listCustomerObservableArray = new ObservableArray();
    this.listCustomerSubject.next(listCustomerObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/customer", this.options).subscribe(
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

  public listSalesDelivery(customerId: number): void {
    let listSalesObservableArray = new ObservableArray();
    this.listSalesDeliverySubject.next(listSalesObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/sales/delivery/" + customerId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesObservableArray.push({
              Id: results[i].Id,
              SDNumber: results[i].SDNumber,
            });
          }
        }
        this.listSalesDeliverySubject.next(listSalesObservableArray);
      }
    );
  }

  public listAssignedUsers(): void {
    let listAssignedToUsersObservableArray = new ObservableArray();
    this.listSupportAssignedToUsersSubject.next(listAssignedToUsersObservableArray);

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
        this.listSupportAssignedToUsersSubject.next(listAssignedToUsersObservableArray);
      }
    );
  }

  public listSupportStatus(): void {
    let listSalesStatusObservableArray = new ObservableArray();
    this.listSupportStatusSubject.next(listSalesStatusObservableArray);

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
        this.listSupportStatusSubject.next(listSalesStatusObservableArray);
      }
    );
  }

  public detailSupport(id: number) {
    let supportDetailModel: SupportModel;
    this.detailSupportSubject.next(supportDetailModel);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/detail/" + id, this.options).subscribe(
      response => {
        var result = response;
        if (result != null) {
          supportDetailModel = {
            Id: result["Id"],
            SPNumber: result["SPNumber"],
            SPDate: result["SPDate"],
            CustomerId: result["CustomerId"],
            Customer: result["ICustomer"],
            SDId: result["SDId"],
            SDNumber: result["SDNumber"],
            ContactPerson: result["ContactPerson"],
            ContactPosition: result["ContactPosition"],
            ContactEmail: result["ContactEmail"],
            ContactPhoneNumber: result["ContactPhoneNumber"],
            Issue: result["Issue"],
            AssignedToUserId: result["AssignedToUserId"],
            AssignedToUser: result["AssignedToUser"],
            Status: result["Status"],
            IsLocked: result["IsLocked"],
            CreatedByUserId: result["CreatedByUserId"],
            CreatedByUser: result["CreatedByUser"],
            CreatedDateTime: result["CreatedDateTime"],
            UpdatedByUserId: result["UpdatedByUserId"],
            UpdatedByUser: result["UpdatedByUser"],
            UpdatedDateTime: result["UpdatedDateTime"],
          }
        }
        this.detailSupportSubject.next(supportDetailModel);
      }
    );
  }

  public supportSales(objSales: SupportModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales/save/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveSupportSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.saveSupportSubject.next(errorResults);
      }
    );
  }

  public lockSales(objSales: SupportModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales/lock/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.lockSupportSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.lockSupportSubject.next(errorResults);
      }
    );
  }

  public unlockSales(objSales: SupportModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales//unlock/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.unlockSupportSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.unlockSupportSubject.next(errorResults);
      }
    );
  }

}
