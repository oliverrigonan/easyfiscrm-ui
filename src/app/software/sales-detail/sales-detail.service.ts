import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { SalesDetailModel } from './sales-detail.model';

@Injectable({
  providedIn: 'root'
})
export class SalesDetailService {

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

  public listSalesAssignedToUsersSubject = new Subject<ObservableArray>();
  public listLeadAssignedToUsersObservable = this.listSalesAssignedToUsersSubject.asObservable();
  public detailSalesSubject = new Subject<SalesDetailModel>();
  public detailSalesObservable = this.detailSalesSubject.asObservable();
  public saveSalesSubject = new Subject<string[]>();
  public saveSalesObservable = this.saveSalesSubject.asObservable();
  public lockSalesSubject = new Subject<string[]>();
  public lockSalesObservable = this.lockSalesSubject.asObservable();
  public unlockSalesSubject = new Subject<string[]>();
  public unlockSalesObservable = this.unlockSalesSubject.asObservable();

  public listAssignedUsers(): void {
    let listAssignedToUsersObservableArray = new ObservableArray();
    this.listSalesAssignedToUsersSubject.next(listAssignedToUsersObservableArray);

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

        this.listSalesAssignedToUsersSubject.next(listAssignedToUsersObservableArray);
      }
    );
  }

  public detailSales(id: number) {
    let salesDetailModel: SalesDetailModel;
    this.detailSalesSubject.next(salesDetailModel);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/detail/" + id, this.options).subscribe(
      response => {
        var result = response;
        if (result != null) {
          salesDetailModel = {
            Id: result["Id"],
            BranchId: result["BranchId"],
            SINumber: result["SINumber"],
            SIDate: result["SIDate"],
            CustomerId: result["CustomerId"],
            TermId: result["TermId"],
            DocumentReference: result["DocumentReference"],
            ManualSINumber: result["ManualSINumber"],
            Remarks: result["Remarks"],
            Amount: result["Amount"],
            PaidAmount: result["PaidAmount"],
            AdjustmentAmount: result["AdjustmentAmount"],
            BalanceAmount: result["BalanceAmount"],
            SoldById: result["SoldById"],
            PreparedById: result["PreparedById"],
            CheckedById: result["CheckedById"],
            ApprovedById: result["ApprovedById"],
            Status: result["Status"],
            IsCancelled: result["IsCancelled"],
            IsPrinted: result["IsPrinted"],
            IsLocked: result["IsLocked"],
            CreatedById: result["CreatedById"],
            CreatedDateTime: result["CreatedDateTime"],
            UpdatedById: result["UpdatedById"],
            UpdatedByDate: result["UpdatedByDate"]
          };
        }
        this.detailSalesSubject.next(salesDetailModel);
      }
    );
  }

  public saveSales(objSales: SalesDetailModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales/save/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveSalesSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.saveSalesSubject.next(errorResults);
      }
    );
  }

  public lockSales(objSales: SalesDetailModel) {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/trn/sales/lock/" + objSales.Id, JSON.stringify(objSales), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.lockSalesSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.lockSalesSubject.next(errorResults);
      }
    );
  }


}
