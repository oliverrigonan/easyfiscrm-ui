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

  public listTrnsactionSummarySubject = new Subject<ObservableArray>();
  public listTrnSummaryObservable = this.listTrnsactionSummarySubject.asObservable();

  public listTrnsactionSummaryPerStatusSubject = new Subject<ObservableArray>();
  public listTrnSummaryPerStatusObservable = this.listTrnsactionSummaryPerStatusSubject.asObservable();

  public listUser(): void {
    let listUserObservableArray = new ObservableArray();
    this.listUserSubject.next(listUserObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/dashboard/users", this.options).subscribe(
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

  public listTransactionFilterByStatusSummary(startDate: string, endDate: string, userId: number): void {
    let listTnrSummaryFilterByStatusObservableArray = new ObservableArray();

    this.listTrnsactionSummaryPerStatusSubject.next(listTnrSummaryFilterByStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/dashboard/trnSummary/status/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listTnrSummaryFilterByStatusObservableArray.push({
              Document: results[i].Document,
              Status: results[i].Status,
              NoOfTransaction: results[i].NoOfTransaction
            });
          }
        }
        this.listTrnsactionSummaryPerStatusSubject.next(listTnrSummaryFilterByStatusObservableArray);
      }
    );
  }

  public listTransactionSummary(startDate: string, endDate: string, userId: number): void {
    let listTransactionSummaryObservableArray = new ObservableArray();

    this.listTrnsactionSummarySubject.next(listTransactionSummaryObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/dashboard/trnSummary/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listTransactionSummaryObservableArray.push({
              Document: results[i].Document,
              Status: results[i].Status,
              NoOfTransaction: results[i].NoOfTransaction
            });
          }
        }
        this.listTrnsactionSummarySubject.next(listTransactionSummaryObservableArray);
      }
    );
  }
}
