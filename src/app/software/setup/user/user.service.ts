import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { UserModel } from './user.model';
import { UserFormModel } from './user-form.model';

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

  public sysFormSubject = new Subject<ObservableArray>();
  public sysFormObservable = this.sysFormSubject.asObservable();

  public userFormListSubject = new Subject<ObservableArray>();
  public userFormListObservable = this.userFormListSubject.asObservable();

  public saveUserFormSubject = new Subject<string[]>();
  public saveserFormObservable = this.saveUserFormSubject.asObservable();

  public deleteUserFormSubject = new Subject<string[]>();
  public deleteUserFormObservable = this.deleteUserFormSubject.asObservable();

  public groupUserSubject = new Subject<ObservableArray>();
  public groupUserObservable = this.groupUserSubject.asObservable();

  public listUser(): void {
    let userListObservableArray = new ObservableArray();
    this.userListSubject.next(userListObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/user/list/user", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            userListObservableArray.push({
              Id: results[i].Id,
              UserName: results[i].UserName,
              FullName: results[i].FullName,
              Email: results[i].Email,
              Password: results[i].Password,
              IsLocked: results[i].IsLocked,
              CRMUserGroup: results[i].CRMUserGroup,
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

  public listGroup(): void {
    let groupObservableArray = new ObservableArray();
    this.groupUserSubject.next(groupObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/user/list/group", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            groupObservableArray.push({ Group: results[i].Group });
          }
        }
        this.groupUserSubject.next(groupObservableArray);
      }
    );
  }

  public saveUser(objUser: UserModel): void {
    if (objUser.Id == 0) {
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

    }
  }

  public updateUser(objUser: UserModel) {
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

  public listSysForm(): void {
    let sysFormListObservableArray = new ObservableArray();
    this.sysFormSubject.next(sysFormListObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/mst/user/form/list/sysForm", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            sysFormListObservableArray.push({
              Id: results[i].Id,
              FormName: results[i].FormName,
              Particulars: results[i].Particulars
            });
          }
        }
        this.sysFormSubject.next(sysFormListObservableArray);
      }
    );
  }

  public listUserForm(Id: number): void {
    let userFormListObservableArray = new ObservableArray();
    this.userFormListSubject.next(userFormListObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/crm/mst/user/form/list/UserForm/" + Id, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            userFormListObservableArray.push({
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
        this.userFormListSubject.next(userFormListObservableArray);
      }
    );
  }

  public SaveUserForm(objUserForm: UserFormModel): void {
    if (objUserForm.Id == 0) {
      this.httpClient.post(this.defaultAPIURLHost + "/api/crm/mst/user/form/add", JSON.stringify(objUserForm), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveUserFormSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveUserFormSubject.next(errorResults);
        }
      );
    }
    else {
      this.httpClient.put(this.defaultAPIURLHost + "/api/crm/mst/user/form/update", JSON.stringify(objUserForm), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveUserFormSubject.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveUserFormSubject.next(errorResults);
        }
      );
    }

  }

  public DeleteUserForm(id: number): void {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/crm/mst/user/form/delete/" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteUserFormSubject.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteUserFormSubject.next(errorResults);
      }
    );
  }

}
