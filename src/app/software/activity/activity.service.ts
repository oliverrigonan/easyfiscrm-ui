import { Injectable } from '@angular/core';
import { AppSettings } from './../../app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { ActivityModel } from './activity.model';

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

  public listActivityHeaderSubject = new Subject<ObservableArray>();
  public listActivityHeadingObservable = this.listActivityHeaderSubject.asObservable();

  public listActivitySubject = new Subject<ObservableArray>();
  public listActivityObservable = this.listActivitySubject.asObservable();

  public listActivityUsersSubject = new Subject<ObservableArray>();
  public listActivityUsersObservable = this.listActivityUsersSubject.asObservable();
  public listActivityStatusSubject = new Subject<ObservableArray>();
  public listActivityStatusObservable = this.listActivityStatusSubject.asObservable();
  public saveActivitySubject = new Subject<string[]>();
  public saveActivityObservable = this.saveActivitySubject.asObservable();
  public deleteActivitySubject = new Subject<string[]>();
  public deleteActivityObservable = this.deleteActivitySubject.asObservable();

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
    let listActivityHeaderObservableArray = new ObservableArray();
    this.listActivityHeaderSubject.next(listActivityHeaderObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/summary/list/" + startDate + "/" + endDate + "/" + document + "/" + status + "/" + userId, this.options).subscribe(
      response => {
        let results = response;

        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            listActivityHeaderObservableArray.push({
              Id: results[i].Id,
              Date: results[i].Date,
              DocType: results[i].DocType,
              Reference: results[i].Reference,
              Customer: results[i].Customer,
              Particular: results[i].Particular,
              LastActivity: results[i].LastActivity,
              Status: results[i].Status,
            });
          }
        }

        this.listActivityHeaderSubject.next(listActivityHeaderObservableArray);
      }
    );
  }

  public listActivity(document: number, supportId: number): void {
    let listActivityObservableArray = new ObservableArray();
    this.listActivitySubject.next(listActivityObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/list/" + document+ "/" + supportId, this.options).subscribe(
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
              SDId: results[i].SIId,
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

  public listActivityUsers(): void {
    let listActivityUsersObservableArray = new ObservableArray();
    this.listActivityUsersSubject.next(listActivityUsersObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/users", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listActivityUsersObservableArray.push({
              Id: results[i].Id,
              FullName: results[i].FullName,
              UserName: results[i].UserName
            });
          }
        }

        this.listActivityUsersSubject.next(listActivityUsersObservableArray);
      }
    );
  }

  public listActivityStatus(): void {
    let listActivityStatusObservableArray = new ObservableArray();
    this.listActivityStatusSubject.next(listActivityStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/status", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listActivityStatusObservableArray.push({
              Id: results[i].Id,
              Status: results[i].Status
            });
          }
        }

        this.listActivityStatusSubject.next(listActivityStatusObservableArray);
      }
    );
  }

  public saveActivity(objActivity: ActivityModel): void {
    if (objActivity.Id == 0) {
      this.httpClient.post(this.defaultAPIURLHost + "/api/crm/trn/activity/add", JSON.stringify(objActivity), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveActivitySubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveActivitySubject.next(errorResults);
        }
      )
    } else {
      this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/activity/update/" + objActivity.Id, JSON.stringify(objActivity), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveActivitySubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveActivitySubject.next(errorResults);
        }
      )
    }
  }

  public deleteActivity(id: number): void {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/trn/activity/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteActivitySubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteActivitySubject.next(errorResults);
      }
    )
  }
}
