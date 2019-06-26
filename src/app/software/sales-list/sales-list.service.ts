import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesListService {

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

  public listSalesSubject = new Subject<ObservableArray>();
  public listSalesObservable = this.listSalesSubject.asObservable();

  public listSales(): void {
    let listSalesObservableArray = new ObservableArray();
    this.listSalesSubject.next(listSalesObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/trn/sales/list", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listSalesObservableArray.push({
              Id: results[i].Id,
              BranchId: results[i].BranchId,
              SINumber: results[i].SINumber,
              SIDate: results[i].SIDate,
              CustomerId: results[i].CustomerId,
              TermId: results[i].TermId,
              DocumentReference: results[i].DocumentReference,
              ManualSINumber: results[i].ManualSINumber,
              Remarks: results[i].Remarks,
              Amount: results[i].Amount,
              PaidAmount: results[i].PaidAmount,
              AdjustmentAmount: results[i].AdjustmentAmount,
              BalanceAmount: results[i].BalanceAmount,
              SoldById: results[i].SoldById,
              PreparedById: results[i].PreparedById,
              CheckedById: results[i].CheckedById,
              ApprovedById: results[i].ApprovedById,
              Status: results[i].Status,
              IsCancelled: results[i].IsCancelled,
              IsPrinted: results[i].IsPrinted,
            });
          }
        }

        this.listSalesSubject.next(listSalesObservableArray);
      }
    );
  }
}
