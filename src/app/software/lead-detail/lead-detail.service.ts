import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { LeadDetailModel } from './lead-detail.model'
import { LeadDetailActivityModel } from './lead-detail-activitiy.model'
import { DocumentModel } from '../document/document.model';

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
  public listProductSubject = new Subject<ObservableArray>();
  public listProductObservable = this.listProductSubject.asObservable();
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

  public listActivityUsersSubject = new Subject<ObservableArray>();
  public listActivityUsersObservable = this.listActivityUsersSubject.asObservable();
  public listActivityStatusSubject = new Subject<ObservableArray>();
  public listActivityStatusObservable = this.listActivityStatusSubject.asObservable();
  public listActivitySubject = new Subject<ObservableArray>();
  public listActivityObservable = this.listActivitySubject.asObservable();
  public saveActivitySubject = new Subject<string[]>();
  public saveActivityObservable = this.saveActivitySubject.asObservable();
  public deleteActivitySubject = new Subject<string[]>();
  public deleteActivityObservable = this.deleteActivitySubject.asObservable();


  public printLeadSubject = new Subject<Blob>();
  public printLeadObservable = this.printLeadSubject.asObservable();
  public printLeadActivitySubject = new Subject<Blob>();
  public printLeadActivityObservable = this.printLeadActivitySubject.asObservable();

  public listProduct(): void {
    let listProductObservableArray = new ObservableArray();
    this.listProductSubject.next(listProductObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/lead/list/product", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listProductObservableArray.push({
              Id: results[i].Id,
              ProductDescription: results[i].ProductDescription
            });
          }
        }
        this.listProductSubject.next(listProductObservableArray);
      }
    );
  }

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
            ProductId: results["ProductId"],
            TotalAmount: results["TotalAmount"],
            Address: results["Address"],
            ContactPerson: results["ContactPerson"],
            ContactPosition: results["ContactPosition"],
            ContactEmail: results["ContactEmail"],
            ContactPhoneNumber: results["ContactPhoneNumber"],
            ReferredBy: results["ReferredBy"],
            Remarks: results["Remarks"],
            AssignedToUserId: results["AssignedToUserId"],
            AssignedToUser: results["AssignedToUser"],
            LastActivity: results["LastActivity"],
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
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/lead/unlock/" + objLead.Id, "", this.options).subscribe(
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

  public saveActivity(objActivity: LeadDetailActivityModel): void {
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

  public printLead(id: number): void {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };
    this.httpClient.get(this.defaultAPIURLHost + "/api/pdf/report/list/lead/" + id, printCaseOptions).subscribe(
      response => {
        let results = new Blob([response], { type: 'application/pdf' });
        this.printLeadSubject.next(results);
      }
    );
  }

  public printLeadActivity(id: number): void {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };
    this.httpClient.get(this.defaultAPIURLHost + "/api/pdf/report/lead/activity/" + id, printCaseOptions).subscribe(
      response => {
        let results = new Blob([response], { type: 'application/pdf' });
        this.printLeadActivitySubject.next(results);
      }
    );
  }

  
}
