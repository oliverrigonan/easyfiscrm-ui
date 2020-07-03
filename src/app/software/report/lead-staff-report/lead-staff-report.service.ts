import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadStaffReportService {

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

  public listSalesStaffReportSubject = new Subject<ObservableArray>();
  public listSalesStaffReportObservable = this.listSalesStaffReportSubject.asObservable();

  public listSalesQuotationReportubject = new Subject<ObservableArray>();
  public listSalesQuotationReportObservable = this.listSalesQuotationReportubject.asObservable();

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
        console.log(listUserObservableArray);
        this.listUserSubject.next(listUserObservableArray);
      }
    );
  }

  public listSalesStaffReport(startDate: string, endDate: String, userId: number): void {
    let listSalesStaffReportObservableArray = new ObservableArray();
    this.listSalesStaffReportSubject.next(listSalesStaffReportObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/sales/staff/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesStaffReportObservableArray.push({
              StaffId: results[i].StaffId,
              Staff: results[i].Staff,
              Introduction: results[i].Introduction,
              Presentation: results[i].Presentation,
              Quotation: results[i].Quotation,
              Invoiced: results[i].Invoiced,
              Cancelled: results[i].Cancelled,
              Total: results[i].Total
            });
          }
        }
        this.listSalesStaffReportSubject.next(listSalesStaffReportObservableArray);
      }
    );
  }

  public listSalesStaffQuotationReport(startDate: string, endDate: String, userId: number): void {
    let listSalesQuotationSummaryObservableArray = new ObservableArray();
    this.listSalesQuotationReportubject.next(listSalesQuotationSummaryObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/sales/staff/quotation/" + startDate + "/" + endDate + "/" + userId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesQuotationSummaryObservableArray.push({
              LDNumber: results[i].LDNumber,
              Customer: results[i].Customer,
              LDQuotationDate: results[i].LDQuotationDate,
              ProductDescription: results[i].ProductDescription,
              Amount: results[i].Amount,
              ExpectedInvoicedDate: results[i].ExpectedInvoicedDate,
              AssignedToUser: results[i].AssignedToUser,
              LastActivity: results[i].LastActivity,
              LastActivityDate: results[i].LastActivityDate,
              LastActivityStaff: results[i].LastActivityStaff
            });
          }
        }
        this.listSalesQuotationReportubject.next(listSalesQuotationSummaryObservableArray);
      }
    );
  }
}
