import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  public openPage(page: string): boolean {
    let openFlag = false;
    if (localStorage.getItem("userRights") != null) {
      try {
        let userRights = JSON.parse(localStorage.getItem("userRights"));
        for (var i = 0; i <= userRights.length - 1; i++) {
          if (userRights[i].Form == page) {
            openFlag = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    return openFlag;
  }
}
