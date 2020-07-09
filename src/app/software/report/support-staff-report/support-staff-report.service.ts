import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportStaffReportService {

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

  public listUserSubject = new Subject<ObservableArray>();
  public listUserObservable = this.listUserSubject.asObservable();

  public listSupportStaffReportSubject = new Subject<ObservableArray>();
  public listSupportStaffReportObservable = this.listSupportStaffReportSubject.asObservable();

  public listOpenSupportReportubject = new Subject<ObservableArray>();
  public listOpenSupportReportObservable = this.listOpenSupportReportubject.asObservable();

  public listUser(): void {
    let listUserObservableArray = new ObservableArray();
    this.listUserSubject.next(listUserObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/users", this.options).subscribe(
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

  public listSupprtStaffReport(startDate: string, endDate: String, userId: number): void {
    let listSupportStaffReportObservableArray = new ObservableArray();
    this.listSupportStaffReportSubject.next(listSupportStaffReportObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/support/staff/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSupportStaffReportObservableArray.push({
              StaffId: results[i].StaffId,
              Staff: results[i].Staff,
              Open: results[i].Open,
              ForClosing: results[i].ForClosing,
              Close: results[i].Close,
              Cancelled: results[i].Cancelled,
              Total: results[i].Total
            });
          }
        }
        this.listSupportStaffReportSubject.next(listSupportStaffReportObservableArray);
      }
    );
  }

  public listOpenSupportStaffReport(startDate: string, endDate: String, userId: number): void {
    let listOpenSupportReportObservableArray = new ObservableArray();
    this.listOpenSupportReportubject.next(listOpenSupportReportObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/support/staff/open/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listOpenSupportReportObservableArray.push({
              SPNumber: results[i].SPNumber,
              Customer: results[i].Customer,
              SupportDate: results[i].SupportDate,
              ProductDescription: results[i].ProductDescription,
              Amount: results[i].Amount,
              ExpectedCloseDate: results[i].ExpectedCloseDate,
              AssignedToUser: results[i].AssignedToUser,
              PointOfContact: results[i].PointOfContact,
              LastActivity: results[i].LastActivity,
              LastActivityDate: results[i].LastActivityDate,
              LastActivityStaff: results[i].LastActivityStaff
            });
          }
        }
        this.listOpenSupportReportubject.next(listOpenSupportReportObservableArray);
      }
    );
  }
}
