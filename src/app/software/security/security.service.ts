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
          if (userRights[i].Form ===  page) {
            openFlag = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    return openFlag;
  }

  public openGroupPage(page: string) {
    let openFlag = false;

    if (localStorage.getItem("userGroup") != null) {
      try {
        let userGroup = localStorage.getItem("userGroup");

        if (page === "Lead") {
          if (userGroup ===  "Sales" || userGroup ===  "Sales Manager" || userGroup ===  "Easyfis Staff" || userGroup ===  "Admin") {
            openFlag = true;
          }
        } else if (page ===  "Delivery") {
          if (userGroup ===  "Delivery" || userGroup ===  "Delivery Manager" || userGroup ===  "Easyfis Staff" || userGroup ===  "Admin") {
            openFlag = true;
          }
        } else if (page ===  "Support") {
          if (userGroup ===  "Support" || userGroup ===  "Support Manager" || userGroup ===  "Easyfis Staff" || userGroup ===  "Customer" || userGroup ===  "Admin") {
            openFlag = true;
          }
        } else if (page ===  "Activity") {
          if (userGroup ===  "Easyfis Staff" || userGroup ===  "Delivery Manager" || userGroup ===  "Sales Manager" || userGroup ===  "Support Manager" || userGroup ===  "Admin") {
            openFlag = true;
          }
        } else if (page ===  "Report") {
          if (userGroup ===  "Easyfis Staff" || userGroup ===  "Delivery Manager" || userGroup ===  "Sales Manager" || userGroup ===  "Support Manager" || userGroup ===  "Admin") {
            openFlag = true;
          }
        } else if (page ===  "Admin") {
          if(userGroup ===  "Admin"){
            openFlag = true;
          }
        } else {
          openFlag = false;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return openFlag;
  }
}
