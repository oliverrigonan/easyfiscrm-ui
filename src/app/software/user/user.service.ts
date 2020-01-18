import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  public userListSubject = new Subject<ObservableArray>();
  public userListObservable = this.userListSubject.asObservable();

  public saveUserSubject = new Subject<string[]>();
  public saveUserObservable = this.saveUserSubject.asObservable();

  public listUser(): void {
    let userListObservableArray = new ObservableArray();
    this.userListSubject.next(userListObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/user/list/user", this.options).subscribe(
      response => {
        var results = response;
        console.log(response);
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            userListObservableArray.push({
              Id: results[i].Id,
              UserName: results[i].UserName,
              FullName: results[i].FullName,
              Email: results[i].Email,
              Password: results[i].Password,
              IsLocked: results[i].IsLocked,
              CreatedBy: results[i].CreatedBy,
              CreatedDateTime: results[i].CreatedDateTime,
              UpdatedBy: results[i].UpdatedBy,
              UpdatedDateTime: results[i].UpdatedDateTime,
            });
          }
        }
        this.userListSubject.next(userListObservableArray);
      }
    );
  }

  public saveUser(objUser: UserModel): void {
    if(objUser.Id == 0){
      this.httpClient.post(this.defaultAPIURLHost + "/api/Account/Register", JSON.stringify(objUser), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", "Add succeccful"];
          this.saveUserSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed"];
  
          var errMessage = error.error;
          if (errMessage != null) {
            if (errMessage.ModelState[""] != null) {
              let mainErrorMessageLength = errMessage.ModelState[""].length;
              for (var i = 0; i < mainErrorMessageLength; i++) {
                errorResults.push(errMessage.ModelState[""][i]);
              }
            }
  
            if (errMessage.ModelState["model.FullName"] != null) {
              let fullnameErrorMessageLength = errMessage.ModelState["model.FullName"].length;
              for (var i = 0; i < fullnameErrorMessageLength; i++) {
                errorResults.push(errMessage.ModelState["model.FullName"][i]);
              }
            }
  
            if (errMessage.ModelState["model.UserName"] != null) {
              let usernameErrorMessageLength = errMessage.ModelState["model.UserName"].length;
              for (var i = 0; i < usernameErrorMessageLength; i++) {
                errorResults.push(errMessage.ModelState["model.UserName"][i]);
              }
            }
  
            if (errMessage.ModelState["model.Password"] != null) {
              let passwordErrorMessageLength = errMessage.ModelState["model.Password"].length;
              for (var i = 0; i < passwordErrorMessageLength; i++) {
                errorResults.push(errMessage.ModelState["model.Password"][i]);
              }
            }
  
            if (errMessage.ModelState["model.ConfirmPassword"] != null) {
              let confirmPasswordErrorMessageLength = errMessage.ModelState["model.ConfirmPassword"].length;
              for (var i = 0; i < confirmPasswordErrorMessageLength; i++) {
                errorResults.push(errMessage.ModelState["model.ConfirmPassword"][i]);
              }
            }
  
            this.saveUserSubject.next(errorResults);
          }
        }
      )
    }
    else {
      this.httpClient.put(this.defaultAPIURLHost + "/api/crm/user/update/" + objUser.Id, JSON.stringify(objUser), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveUserSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveUserSubject.next(errorResults);
        }
      );

    }
    
  }

}
