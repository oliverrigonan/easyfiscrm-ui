import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesListService {

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

  public listStatusSubject = new Subject<ObservableArray>();
  public listStatusObservable = this.listStatusSubject.asObservable();

  public listSalesSubject = new Subject<ObservableArray>();
  public listSalesObservable = this.listSalesSubject.asObservable();

  public addSalesSubject = new Subject<string[]>();
  public addSalesObservable = this.addSalesSubject.asObservable();

  public deleteSalesDeliverySubject = new Subject<string[]>();
  public deleteSalesDeliveryObservable = this.deleteSalesDeliverySubject.asObservable();

  public listStatus(): void {
    let listStatusObservableArray = new ObservableArray();
    this.listStatusSubject.next(listStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/status", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listStatusObservableArray.push({
              Id: results[i].Id,
              Status: results[i].Status
            });
          }
        }

        this.listStatusSubject.next(listStatusObservableArray);
      }
    );
  }

  public listSales(startDate: string, endDate: string, status: string): void {
    let listSalesObservableArray = new ObservableArray();
    this.listSalesSubject.next(listSalesObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/" + startDate + "/" + endDate + "/" + status, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesObservableArray.push({
              Id: results[i].Id,
              SDNumber: results[i].SDNumber,
              SDDate: results[i].SDDate,
              RenewalDate: results[i].RenewalDate,
              CustomerId: results[i].CustomerId,
              Customer: results[i].Customer,
              SIId: results[i].ProductId,
              ProductDescription: results[i].ProductDescription,
              LDId: results[i].LDId,
              LDNumber: results[i].LDNumber,
              ContactPerson: results[i].ContactPerson,
              ContactPosition: results[i].ContactPosition,
              ContactEmail: results[i].ContactEmail,
              ContactPhoneNumber: results[i].ContactPhoneNumber,
              Remarks: results[i].Particulars,
              AssignedToUserId: results[i].AssignedToUserId,
              AssignedToUser: results[i].AssignedToUser,
              Status: results[i].Status,
              LastActivity: results[i].LastActivity,
              LastActivityDate: results[i].LastActivityDate,
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
        this.listSalesSubject.next(listSalesObservableArray);
      }
    );
  }

  public listSalesFilteredByUser(startDate: string, endDate: string, status: string, userId: number): void {
    let listSalesObservableArray = new ObservableArray();
    this.listSalesSubject.next(listSalesObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list/" + startDate + "/" + endDate + "/" + status+ "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesObservableArray.push({
              Id: results[i].Id,
              SDNumber: results[i].SDNumber,
              SDDate: results[i].SDDate,
              RenewalDate: results[i].RenewalDate,
              CustomerId: results[i].CustomerId,
              Customer: results[i].Customer,
              SIId: results[i].ProductId,
              ProductDescription: results[i].ProductDescription,
              LDId: results[i].LDId,
              LDNumber: results[i].LDNumber,
              ContactPerson: results[i].ContactPerson,
              ContactPosition: results[i].ContactPosition,
              ContactEmail: results[i].ContactEmail,
              ContactPhoneNumber: results[i].ContactPhoneNumber,
              Remarks: results[i].Particulars,
              AssignedToUserId: results[i].AssignedToUserId,
              AssignedToUser: results[i].AssignedToUser,
              Status: results[i].Status,
              LastActivity: results[i].LastActivity,
              LastActivityDate: results[i].LastActivityDate,
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
        this.listSalesSubject.next(listSalesObservableArray);
      }
    );
  }

  public AddSales(): void {
    this.httpClient.post(this.defaultAPIURLHost + "/api/crm/trn/sales/add", "", this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", response.toString()];
        this.addSalesSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.addSalesSubject.next(errorResults);
      }
    );
  }

  public DeleteSalesDelivery(id: number) {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/trn/sales/delete/" + id, this.options).subscribe(
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
