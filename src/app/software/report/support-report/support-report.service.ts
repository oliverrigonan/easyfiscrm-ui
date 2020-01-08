import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportReportService {

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

  public listSupportSubject = new Subject<ObservableArray>();
  public listSupportObservable = this.listSupportSubject.asObservable();

  public listStatus(): void {
    let listStatusObservableArray = new ObservableArray();
    this.listStatusSubject.next(listStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/status", this.options).subscribe(
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

  public listSupport(startDate: string, endDate: string, status: string): void {
    let listSupportObservableArray = new ObservableArray();
    this.listSupportSubject.next(listSupportObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/" + startDate + "/" + endDate + "/" + status, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSupportObservableArray.push({
              Id: results[i].Id,
              SPNumber: results[i].SPNumber,
              SPDate: results[i].SPDate,
              CustomerId: results[i].CustomerId,
              Customer: results[i].Customer,
              SDId: results[i].SDId,
              SDNumber: results[i].SDNumber,
              ContactPerson: results[i].ContactPerson,
              ContactPosition: results[i].ContactPosition,
              ContactEmail: results[i].ContactEmail,
              ContactPhoneNumber: results[i].ContactPhoneNumber,
              Issue: results[i].Issue,
              AssignedToUserId: results[i].AssignedToUserId,
              AssignedToUser: results[i].AssignedToUser,
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
        this.listSupportSubject.next(listSupportObservableArray);
      }
    );
  }
}
