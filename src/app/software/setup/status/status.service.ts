import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { StatusModel } from './status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

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

  public listStatusSubject = new Subject<ObservableArray>();
  public listStatusObservable = this.listStatusSubject.asObservable();

  public listCategorySubject = new Subject<ObservableArray>();
  public listCategoryObservable = this.listCategorySubject.asObservable();

  public addStatusSubject = new Subject<string[]>();
  public addStatusObservable = this.addStatusSubject.asObservable();

  public updateStatusSubject = new Subject<string[]>();
  public updateStatusObservable = this.updateStatusSubject.asObservable();

  public deleteStatusSubject = new Subject<string[]>();
  public deleteStatusObservable = this.deleteStatusSubject.asObservable();

  public listStatus(): void {
    let statusListObservableArray = new ObservableArray();
    this.listStatusSubject.next(statusListObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/mst/status/list", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            statusListObservableArray.push({
              Id: results[i].Id,
              Status: results[i].Status,
              Category: results[i].Category,
              CreatedByUserId: results[i].CreatedByUserId,
              CreatedBy: results[i].CreatedByUser,
              CreatedDateTime: results[i].CreatedDateTime,
              UpdatedByUserId: results[i].UpdatedByUserId,
              UpdatedByUser: results[i].UpdatedByUser,
              UpdatedDateTime: results[i].UpdatedDateTime,
            });
          }
        }
        this.listStatusSubject.next(statusListObservableArray);
      }
    );
  }

  public listCategory(): void {
    let categoryListObservableArray = new ObservableArray();
    this.listCategorySubject.next(categoryListObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/mst/status/category/list", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            categoryListObservableArray.push({
              Id: results[i].Id,
              Code: results[i].Code,
              Name: results[i].Name,
            });
          }
        }
        this.listCategorySubject.next(categoryListObservableArray);
      }
    );
  }

  public AddStatus(objStatus: StatusModel): void {
    this.httpClient.post(this.defaultAPIURLHost + "/api/crm/mst/status/add", JSON.stringify(objStatus), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.addStatusSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.addStatusSubject.next(errorResults);
      }
    );
  }

  public UpdateStatus(objStatus: StatusModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/crm/mst/status/update/", JSON.stringify(objStatus) ,this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.updateStatusSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.updateStatusSubject.next(errorResults);
      }
    );
  }  

  public deleteStatus(id: number) {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/mst/status/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteStatusSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteStatusSubject.next(errorResults);
      }
    );
  }
}
