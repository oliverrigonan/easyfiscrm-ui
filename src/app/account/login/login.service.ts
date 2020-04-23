import { Injectable } from '@angular/core';
import { AppSettings } from '../../../app/app-settings';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  public defaultAPIHostURL: string = this.appSettings.defaultAPIURLHost;

  public loginSource = new Subject<[boolean, string]>();
  public loginObservable = this.loginSource.asObservable();

  public login(username: string, password: string): void {
    let url = this.defaultAPIHostURL + '/token';
    let body = "username=" + username + "&password=" + password + "&grant_type=password";
    let options = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

    this.httpClient.post(url, body, options).subscribe(
      response => {
        localStorage.setItem('access_token', response["access_token"]);
        localStorage.setItem('expires_in', response["expires_in"]);
        localStorage.setItem('token_type', response["token_type"]);
        localStorage.setItem('username', response["userName"]);

        this.getUserRights(response["userName"]);
        this.loginSource.next([true, "Login Successful."]);
      },
      error => {
        this.loginSource.next([false, error["error"].error_description]);
      }
    )
  }

  public getUserRights(username: string): void {

    let url = this.defaultAPIHostURL + '/token';
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

    let userRights = new Array();

    this.httpClient.get(this.defaultAPIHostURL + "/api/crm/mst/user/form/list/UserFormByUserName/" + username, options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            userRights.push({
              Id: results[i].Id,
              UserId: results[i].UserId,
              FormId: results[i].FormId,
              Form: results[i].Form,
              CanAdd: results[i].CanAdd,
              CanEdit: results[i].CanEdit,
              CanDelete: results[i].CanDelete,
              CanLock: results[i].CanLock,
              CanUnlock: results[i].CanUnlock,
              CanCancel: results[i].CanCancel,
              CanPrint: results[i].CanPrint
            });
          }
        }
        localStorage.setItem('userRights', JSON.stringify(userRights));
      }
    );
  }
}
