import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient) { }

  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };
  public defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  public listUserSubject = new Subject<ObservableArray>();
  public listUserObservable = this.listUserSubject.asObservable();

  public listLeadSummarySubject = new Subject<ObservableArray>();
  public listLeadSummaryObservable = this.listLeadSummarySubject.asObservable();

  public listSalesDeliverySummarySubject = new Subject<ObservableArray>();
  public listSalesDeliverySummaryObservable = this.listSalesDeliverySummarySubject.asObservable();

  public listSupportSummarySubject = new Subject<ObservableArray>();
  public listSupportSummaryObservable = this.listSupportSummarySubject.asObservable();

  public listUser(): void {
    let listUserObservableArray = new ObservableArray();
    this.listUserSubject.next(listUserObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/summary/dashboard/users", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listUserObservableArray.push({
              Id: results[i].Id,
              FullName: results[i].FullName,
              UserName: results[i].UserName
            });
          }
        }

        this.listUserSubject.next(listUserObservableArray);
      }
    );
  }

  public listLeadSummary(startDate: string, endDate: string, userId: number): void {
    let listLeadSummaryObservableArray = new ObservableArray();
    this.listLeadSummarySubject.next(listLeadSummaryObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/summary/dashboard/lead/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listLeadSummaryObservableArray.push({
              Status: results[i].Status,
              NoOfTransaction: results[i].NoOfTransaction
            });
          }
        }

        this.listLeadSummarySubject.next(listLeadSummaryObservableArray);
      }
    );
  }

  public listSalesDeliverySummary(startDate: string, endDate: string, userId: number): void {
    let listSalesDeliverySummaryObservableArray = new ObservableArray();
    this.listSalesDeliverySummarySubject.next(listSalesDeliverySummaryObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/summary/dashboard/salesDelivery/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesDeliverySummaryObservableArray.push({
              Status: results[i].Status,
              NoOfTransaction: results[i].NoOfTransaction
            });
          }
        }

        this.listSalesDeliverySummarySubject.next(listSalesDeliverySummaryObservableArray);
      }
    );
  }

  public listSupportSummary(startDate: string, endDate: string, userId: number): void {
    let listSupportSummaryObservableArray = new ObservableArray();
    this.listSupportSummarySubject.next(listSupportSummaryObservableArray);
    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/summary/dashboard/support/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSupportSummaryObservableArray.push({
              Status: results[i].Status,
              NoOfTransaction: results[i].NoOfTransaction
            });
          }
        }

        this.listSupportSummarySubject.next(listSupportSummaryObservableArray);
      }
    );
  }

}