import { Injectable } from '@angular/core';
import { AppSettings } from './../../app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;
  public options: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

  public listUserSubject = new Subject<ObservableArray>();
  public listUserObservable = this.listUserSubject.asObservable();

  public listDocumentSubject = new Subject<ObservableArray>();
  public listDocumentObservable = this.listDocumentSubject.asObservable();

  public listStatusSubject = new Subject<ObservableArray>();
  public listStatusObservable = this.listStatusSubject.asObservable();

  public listActivitySubject = new Subject<ObservableArray>();
  public listActivityObservable = this.listActivitySubject.asObservable();

  public listUser(): void {
    let listUserObservableArray = new ObservableArray();
    this.listUserSubject.next(listUserObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/users", this.options).subscribe(
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

  public listDocument(): void {
    let listDocumentObservableArray = new ObservableArray();
    this.listDocumentSubject.next(listDocumentObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/list/document", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listDocumentObservableArray.push({
              Id: results[i].Id,
              Category: results[i].Category
            });
          }
        }

        this.listDocumentSubject.next(listDocumentObservableArray);
      }
    );
  }

  public listStatus(document: string): void {
    let listStatusObservableArray = new ObservableArray();
    this.listStatusSubject.next(listStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/list/status/" + document, this.options).subscribe(
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

  public listActivityHeader(startDate: string, endDate: string, document: string, status: string, userId: number): void {
    let listActivityObservableArray = new ObservableArray();
    this.listActivitySubject.next(listActivityObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/summary/list/" + startDate + "/" + endDate + "/" + document + "/" + status + "/" + userId, this.options).subscribe(
      response => {
        let results = response;

        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            listActivityObservableArray.push({
              Id: results[i].Id,
              Date: results[i].Date,
              DocType: results[i].DocType,
              Reference: results[i].Reference,
              Customer: results[i].Customer,
              Particular: results[i].Particular,
              Status: results[i].Status,
            });
          }
        }

        this.listActivitySubject.next(listActivityObservableArray);
      }
    );
  }
}
