import { Injectable } from '@angular/core';
import { AppSettings } from './../../app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
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

  public listStatusSubject = new Subject<ObservableArray>();
  public listStatusObservable = this.listStatusSubject.asObservable();
  public listLeadSubject = new Subject<ObservableArray>();
  public listLeadObservable = this.listLeadSubject.asObservable();
  public addLeadSubject = new Subject<string[]>();
  public addLeadObservable = this.addLeadSubject.asObservable();
  public deleteLeadSubject = new Subject<string[]>();
  public deleteLeadObservable = this.deleteLeadSubject.asObservable();

  public listStatus(): void {
    let listStatusObservableArray = new ObservableArray();
    this.listStatusSubject.next(listStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/status", this.options).subscribe(
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

  public listLead(startDate: string, endDate: string, status: string): void {
    let listLeadObservableArray = new ObservableArray();
    this.listLeadSubject.next(listLeadObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/" + startDate + "/" + endDate + "/" + status, this.options).subscribe(
      response => {
        let results = response;

        if (results["length"] > 0) {
          for (let i = 0; i <= results["length"] - 1; i++) {
            listLeadObservableArray.push({
              Id: results[i].Id,
              LDNumber: results[i].LDNumber,
              LDDate: results[i].LDDate,
              Name: results[i].Name,
              Address: results[i].Address,
              ContactPerson: results[i].ContactPerson,
              ContactPosition: results[i].ContactPosition,
              ContactEmail: results[i].ContactEmail,
              ContactPhoneNumber: results[i].ContactPhoneNumber,
              ReferredBy: results[i].ReferredBy,
              Remarks: results[i].Remarks,
              AssignedToUserId: results[i].AssignedToUserId,
              AssignedToUser: results[i].AssignedToUser,
              LastActivity: results[i].LastActivity,
              LastActivityDate: results[i].LastActivityDate,
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

        this.listLeadSubject.next(listLeadObservableArray);
      }
    );
  }

  public addLead(): void {
    this.httpClient.post(this.defaultAPIURLHost + "/api/crm/trn/lead/add", "", this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", response.toString()];
        this.addLeadSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.addLeadSubject.next(errorResults);
      }
    )
  }

  public deleteLead(id: number): void {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/trn/lead/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteLeadSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteLeadSubject.next(errorResults);
      }
    )
  }
}