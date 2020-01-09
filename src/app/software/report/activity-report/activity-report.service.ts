import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { AppSettings } from 'src/app/app-settings';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportService {

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

  public listDocumentSubject = new Subject<ObservableArray>();
  public listDocumentObservable = this.listDocumentSubject.asObservable();
  public listStatusSubject = new Subject<ObservableArray>();
  public listStatusObservable = this.listStatusSubject.asObservable();
  public listActivitySubject = new Subject<ObservableArray>();
  public listActivityObservable = this.listActivitySubject.asObservable();

  public listDocument(): void {
    let listDocumentObservableArray = new ObservableArray();
    this.listDocumentSubject.next(listDocumentObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/list/document", this.options).subscribe(
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

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/list/status/" + document, this.options).subscribe(
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

  public listActivity(startDate: string, endDate: string, document: string, status: string): void {
    let listActivityObservableArray = new ObservableArray();
    this.listActivitySubject.next(listActivityObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/activity/list/" + startDate + "/" + endDate + "/" + document + "/" + status, this.options).subscribe(
      response => {
        let results = response;

        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            listActivityObservableArray.push({
              Id: results[i].Id,
              Document: results[i].Document,
              ACNumber: results[i].ACNumber,
              ACDate: results[i].ACDate,
              User: results[i].User,
              Functional: results[i].Functional,
              Technical: results[i].Technical,
              CRMStatus: results[i].CRMStatus,
              Activity: results[i].Activity,
              StartDateTime: results[i].StartDateTime,
              EndDateTime: results[i].EndDateTime,
              TransportationCost: results[i].TransportationCost,
              OnSiteCost: results[i].OnSiteCost,
              Status: results[i].Status,
              IsLocked: results[i].IsLocked,
              CreatedByUser: results[i].CreatedByUser,
              CreatedDateTime: results[i].CreatedDateTime,
              UpdatedByUser: results[i].UpdatedByUser,
              UpdatedDateTime: results[i].UpdatedDateTime
            });
          }
        }

        this.listActivitySubject.next(listActivityObservableArray);
      }
    );
  }
}
