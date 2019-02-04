import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { LeadDetailModel } from './lead-detail.model'

@Injectable({
  providedIn: 'root'
})
export class LeadDetailService {

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

  public listLeadAssignedToUsersSubject = new Subject<ObservableArray>();
  public listLeadAssignedToUsersObservable = this.listLeadAssignedToUsersSubject.asObservable();
  public detailLeadSubject = new Subject<LeadDetailModel>();
  public detailLeadObservable = this.detailLeadSubject.asObservable();
  public saveLeadSubject = new Subject<string[]>();
  public saveLeadObservable = this.saveLeadSubject.asObservable();
  public lockLeadSubject = new Subject<string[]>();
  public lockLeadObservable = this.lockLeadSubject.asObservable();
  public unlockLeadSubject = new Subject<string[]>();
  public unlockLeadObservable = this.unlockLeadSubject.asObservable();

  public listAssignedUsers(): void {
    let listAssignedToUsersObservableArray = new ObservableArray();
    this.listLeadAssignedToUsersSubject.next(listAssignedToUsersObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/users", this.options).subscribe(
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

        this.listLeadAssignedToUsersSubject.next(listAssignedToUsersObservableArray);
      }
    );
  }

  public detailLead(id: number): void {
    let leadDetailModel: LeadDetailModel;
    this.detailLeadSubject.next(leadDetailModel);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/detail/" + id, this.options).subscribe(
      response => {
        var results = response;
        if (results != null) {
          leadDetailModel = {
            Id: results["Id"],
            LDNumber: results["LDNumber"],
            LDDate: results["LDDate"],
            Name: results["Name"],
            Address: results["Address"],
            ContactPerson: results["ContactPerson"],
            ContactPosition: results["ContactPosition"],
            ContactEmail: results["ContactEmail"],
            ContactPhoneNumber: results["ContactPhoneNumber"],
            ReferredBy: results["ReferredBy"],
            Remarks: results["Remarks"],
            AssignedToUserId: results["AssignedToUserId"],
            AssignedToUser: results["AssignedToUser"],
            Status: results["Status"],
            IsLocked: results["IsLocked"],
            CreatedByUserId: results["CreatedByUserId"],
            CreatedByUser: results["CreatedByUser"],
            CreatedDateTime: results["CreatedDateTime"],
            UpdatedByUserId: results["UpdatedByUserId"],
            UpdatedByUser: results["UpdatedByUser"],
            UpdatedDateTime: results["UpdatedDateTime"]
          };
        }

        this.detailLeadSubject.next(leadDetailModel);
      }
    );
  }

  public saveLead(objLead: LeadDetailModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/lead/save/" + objLead.Id, JSON.stringify(objLead), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveLeadSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.saveLeadSubject.next(errorResults);
      }
    );
  }

  public lockLead(objLead: LeadDetailModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/lead/lock/" + objLead.Id, JSON.stringify(objLead), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.lockLeadSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.lockLeadSubject.next(errorResults);
      }
    );
  }

  public unlockLead(objLead: LeadDetailModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/lead/unlock/" + objLead.Id, JSON.stringify(objLead), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.unlockLeadSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.unlockLeadSubject.next(errorResults);
      }
    );
  }
}
