import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesDeliveryStaffReportService {

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

  public listSalesDeliveryStaffReportSubject = new Subject<ObservableArray>();
  public listSalesDeliverStaffReportObservable = this.listSalesDeliveryStaffReportSubject.asObservable();

  public listOpenSalesDeliveryReportubject = new Subject<ObservableArray>();
  public listOpenSalesDeliveryReportObservable = this.listOpenSalesDeliveryReportubject.asObservable();

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

  public listSalesDeliveryStaffReport(startDate: string, endDate: String, userId: number): void {
    let listSalesDeliveryStaffReportObservableArray = new ObservableArray();
    this.listSalesDeliveryStaffReportSubject.next(listSalesDeliveryStaffReportObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/sales-delivery/staff/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesDeliveryStaffReportObservableArray.push({
              StaffId: results[i].StaffId,
              Staff: results[i].Staff,
              Open: results[i].Open,
              ForAcceptance: results[i].ForAcceptance,
              Close: results[i].Close,
              Cancelled: results[i].Cancelled,
              Total: results[i].Total
            });
          }
        }
        this.listSalesDeliveryStaffReportSubject.next(listSalesDeliveryStaffReportObservableArray);
      }
    );
  }

  public listOpenSalesDeliveryStaffReport(startDate: string, endDate: String, userId: number): void {
    let listOpenSalesDeliveryReporObservableArray = new ObservableArray();
    this.listOpenSalesDeliveryReportubject.next(listOpenSalesDeliveryReporObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/sales-delivery/staff/open/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listOpenSalesDeliveryReporObservableArray.push({
              SDNumber: results[i].SDNumber,
              Customer: results[i].Customer,
              SDDeliveryDate: results[i].SDDeliveryDate,
              ProductDescription: results[i].ProductDescription,
              Amount: results[i].Amount,
              ExpectedAcceptanceDate: results[i].ExpectedAcceptanceDate,
              AssignedToUser: results[i].AssignedToUser,
              LastActivity: results[i].LastActivity,
              LastActivityDate: results[i].LastActivityDate,
              LastActivityStaff: results[i].LastActivityStaff
            });
          }
        }
        this.listOpenSalesDeliveryReportubject.next(listOpenSalesDeliveryReporObservableArray);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        console.log(errorResults);
        this.listOpenSalesDeliveryReportubject.next(listOpenSalesDeliveryReporObservableArray);
      }
    );
  }
}
