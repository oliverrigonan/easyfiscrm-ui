import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { SupportModel } from '../support-list/support-list.model';
import { SupportDetailActivityModel } from './support-detail-activity.model';

@Injectable({
  providedIn: 'root'
})
export class SupportDetailService {

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

  public listCustomerSubject = new Subject<ObservableArray>();
  public listCustomerObservable = this.listCustomerSubject.asObservable();

  public listSalesDeliverySubject = new Subject<ObservableArray>();
  public listSalesDeliveryObservable = this.listSalesDeliverySubject.asObservable();

  public listSupportAssignedToUsersSubject = new Subject<ObservableArray>();
  public listLeadAssignedToUsersObservable = this.listSupportAssignedToUsersSubject.asObservable();

  public listSupportStatusSubject = new Subject<ObservableArray>();
  public listSupportStatusObservable = this.listSupportStatusSubject.asObservable();

  public defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  public detailSupportSubject = new Subject<SupportModel>();
  public detailSupportObservable = this.detailSupportSubject.asObservable();

  public saveSupportSubject = new Subject<string[]>();
  public saveSupportObservable = this.saveSupportSubject.asObservable();
  
  public lockSupportSubject = new Subject<string[]>();
  public lockSupportObservable = this.lockSupportSubject.asObservable();

  public unlockSupportSubject = new Subject<string[]>();
  public unlockSupportObservable = this.unlockSupportSubject.asObservable();

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

  public listCustomer(): void {
    let listCustomerObservableArray = new ObservableArray();
    this.listCustomerSubject.next(listCustomerObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/customer", this.options).subscribe(
      response => {
        var results = response;
        console.log(results);
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listCustomerObservableArray.push({
              Id: results[i].Id,
              ArticleCode: results[i].ArticleCode,
              Article: results[i].Article,
              ContactPerson: results[i].ContactPerson
            });
          }
        }
        this.listCustomerSubject.next(listCustomerObservableArray);
      }
    );
  }

  public listSalesDelivery(customerId: number): void {
    let listSupportObservableArray = new ObservableArray();
    this.listSalesDeliverySubject.next(listSupportObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/sales/delivery/" + customerId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSupportObservableArray.push({
              Id: results[i].Id,
              SDNumber: results[i].SDNumber + " - " + results[i].SDDate + " - " + results[i].ProductDescription + " - " + results[i].AssignedToUser,
              ContactPerson: results[i].ContactPerson,
              ContactPosition: results[i].ContactPosition,
              ContactEmail: results[i].ContactEmail,
              ContactPhoneNumber: results[i].ContactPhoneNumber
            });
          }
        }
        this.listSalesDeliverySubject.next(listSupportObservableArray);
      }
    );
  }

  public listAssignedUsers(): void {
    let listAssignedToUsersObservableArray = new ObservableArray();
    this.listSupportAssignedToUsersSubject.next(listAssignedToUsersObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/users", this.options).subscribe(
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
        this.listSupportAssignedToUsersSubject.next(listAssignedToUsersObservableArray);
      }
    );
  }

  public listSupportStatus(): void {
    let listSupportStatusObservableArray = new ObservableArray();
    this.listSupportStatusSubject.next(listSupportStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/list/status", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSupportStatusObservableArray.push({
              Id: results[i].Id,
              Status: results[i].Status
            });
          }
        }
        this.listSupportStatusSubject.next(listSupportStatusObservableArray);
      }
    );
  }

  public detailSupport(id: number) {
    let supportDetailModel: SupportModel;
    this.detailSupportSubject.next(supportDetailModel);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/support/detail/" + id, this.options).subscribe(
      response => {
        var result = response;
        if (result != null) {
          supportDetailModel = {
            Id: result["Id"],
            SPNumber: result["SPNumber"],
            SPDate: result["SPDate"],
            CustomerId: result["CustomerId"],
            Customer: result["Customer"],
            SDId: result["SDId"],
            SDNumber: result["SDNumber"],
            ContactPerson: result["ContactPerson"],
            ContactPosition: result["ContactPosition"],
            ContactEmail: result["ContactEmail"],
            ContactPhoneNumber: result["ContactPhoneNumber"],
            Issue: result["Issue"],
            AssignedToUserId: result["AssignedToUserId"],
            AssignedToUser: result["AssignedToUser"],
            Status: result["Status"],
            IsLocked: result["IsLocked"],
            CreatedByUserId: result["CreatedByUserId"],
            CreatedByUser: result["CreatedByUser"],
            CreatedDateTime: result["CreatedDateTime"],
            UpdatedByUserId: result["UpdatedByUserId"],
            UpdatedByUser: result["UpdatedByUser"],
            UpdatedDateTime: result["UpdatedDateTime"],
          }
        }
        this.detailSupportSubject.next(supportDetailModel);
      }
    );
  }

  public saveSupport(objSupport: SupportModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/support/save/" + objSupport.Id, JSON.stringify(objSupport), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveSupportSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.saveSupportSubject.next(errorResults);
      }
    );
  }

  public lockSupport(objSupport: SupportModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/support/lock/" + objSupport.Id, JSON.stringify(objSupport), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.lockSupportSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.lockSupportSubject.next(errorResults);
      }
    );
  }

  public unlockSupport(objSupport: SupportModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/support/unlock/" + objSupport.Id, JSON.stringify(objSupport), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.unlockSupportSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.unlockSupportSubject.next(errorResults);
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

  public listActivity(supportId: number): void {
    let listActivityObservableArray = new ObservableArray();
    this.listActivitySubject.next(listActivityObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/activity/support/list/" + supportId, this.options).subscribe(
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

  public saveActivity(objActivity: SupportDetailActivityModel): void {
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

  public printSupportSubject = new Subject<Blob>();
  public printLeadObservable = this.printSupportSubject.asObservable();

  public printLead(id: number): void {
    let printCaseOptions: any = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      }),
      responseType: "blob"
    };

    this.httpClient.get(this.defaultAPIURLHost + "/api/pdf/report/list/support/" + id, printCaseOptions).subscribe(
      response => {
        let results = new Blob([response], { type: 'application/pdf' });
        this.printSupportSubject.next(results);
      }
    );
  }
}
