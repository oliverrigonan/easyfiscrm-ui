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
  public listStatusSubject = new Subject<ObservableArray>();
  public listStatusObservable = this.listStatusSubject.asObservable();
  public detailLeadSubject = new Subject<LeadDetailModel>();
  public detailLeadObservable = this.detailLeadSubject.asObservable();
  public saveLeadSubject = new Subject<string[]>();
  public saveLeadObservable = this.saveLeadSubject.asObservable();
  public lockLeadSubject = new Subject<string[]>();
  public lockLeadObservable = this.lockLeadSubject.asObservable();
  public unlockLeadSubject = new Subject<string[]>();
  public unlockLeadObservable = this.unlockLeadSubject.asObservable();

  public listActivitySubject = new Subject<ObservableArray>();
  public listActivityObservable = this.listActivitySubject.asObservable();
  public addActivitySubject = new Subject<string[]>();
  public addActivityObservable = this.addActivitySubject.asObservable();
  public updateActivitySubject = new Subject<string[]>();
  public updateActivityObservable = this.updateActivitySubject.asObservable();
  public deleteActivitySubject = new Subject<string[]>();
  public deleteActivityObservable = this.deleteActivitySubject.asObservable();

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

  public listActivity(leadId: number): void {
    let listActivityObservableArray = new ObservableArray();
    this.listActivitySubject.next(listActivityObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/lead/list/" + leadId, this.options).subscribe(
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
              StartDateTime: results[i].StartDateTime,
              EndDateTime: results[i].EndDateTime,
              TransportationCost: results[i].TransportationCost,
              OnSiteCost: results[i].OnSiteCost,
              LDId: results[i].LDId,
              SIId: results[i].SIId,
              SPId: results[i].SPId,
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
