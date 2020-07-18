import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private router: Router
  ) { }


  public openPage(page: string): boolean {
    let openFlag = false;
    if (localStorage.getItem("userRights") != null) {
      try {
        let userRights = JSON.parse(localStorage.getItem("userRights"));
        for (var i = 0; i <= userRights.length - 1; i++) {
          if (userRights[i].Form === page) {
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
          if (userGroup === "Sales" || userGroup === "Sales Manager" || userGroup === "Easyfis Staff" || userGroup === "Admin") {
            openFlag = true;
          }
        } else if (page === "Delivery") {
          if (userGroup === "Delivery" || userGroup === "Delivery Manager" || userGroup === "Easyfis Staff" || userGroup === "Admin") {
            openFlag = true;
          }
        } else if (page === "Support") {
          if (userGroup === "Support" || userGroup === "Support Manager" || userGroup === "Easyfis Staff" || userGroup === "Customer" || userGroup === "Admin") {
            openFlag = true;
          }
        } else if (page === "Activity") {
          if (userGroup === "Easyfis Staff" || userGroup === "Delivery Manager" || userGroup === "Sales Manager" || userGroup === "Support Manager" || userGroup === "Admin") {
            openFlag = true;
          }
        } else if (page === "Report") {
          if (userGroup === "Easyfis Staff" || userGroup === "Delivery Manager" || userGroup === "Sales Manager" || userGroup === "Support Manager" || userGroup === "Admin") {
            openFlag = true;
          }
        } else if (page === "Product") {
          if (userGroup === "Easyfis Staff" || userGroup === "Admin") {
            openFlag = true;
          }
        } else if (page === "Admin") {
          if (userGroup === "Admin") {
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

  public pageTab(pageTab: string) {
    let isAuthorizedFlag = false;

    if (localStorage.getItem("userGroup") != null) {
      try {
        let userGroup = localStorage.getItem("userGroup");

        if (pageTab == "Document") {
          if (userGroup === "Easyfis Staff" || userGroup === "Admin") {
            isAuthorizedFlag = true;
          }
        }
        else {
          isAuthorizedFlag = false;
        }

      } catch (e) {
        console.log(e);
      }
    }
    return isAuthorizedFlag;
  }

  public pageAuthentication(currentUrl) {
    let userGroup = localStorage.getItem("userGroup");

    if (localStorage.getItem("userGroup") != null) {
      try {
        let userGroup = localStorage.getItem("userGroup");

        if (currentUrl === "/software/trn/lead" || currentUrl === "/software/trn/lead" || currentUrl === "/software/trn/lead/:startDate/:endDate/:status/:userId/:dashboard" || currentUrl === "/software/trn/lead/detail/:id") {
          if (userGroup === "Sales" || userGroup === "Sales Manager" || userGroup === "Easyfis Staff" || userGroup === "Admin") {
          } else {
            this.router.navigate(['/software']);
          }
        } else if (currentUrl === "/software/trn/sales" || currentUrl === "/software/trn/sales/:startDate/:endDate/:status/:userId/:dashboard" || currentUrl === "/software/trn/sales/detail/:id") {
          if (userGroup === "Delivery" || userGroup === "Delivery Manager" || userGroup === "Easyfis Staff" || userGroup === "Admin") {
          } else {
            this.router.navigate(['/software']);
          }
        } else if (currentUrl === "/software/trn/support" || currentUrl === "/software/trn/support/:startDate/:endDate/:status/:userId/:dashboard" || currentUrl === "/software/trn/support/detail/:id") {
          if (userGroup === "Support" || userGroup === "Support Manager" || userGroup === "Easyfis Staff" || userGroup === "Customer" || userGroup === "Admin") {
          }
        } else if (currentUrl === "/software/trn/activity") {
          if (userGroup === "Easyfis Staff" || userGroup === "Delivery Manager" || userGroup === "Sales Manager" || userGroup === "Support Manager" || userGroup === "Admin") {
          }
        } else if (currentUrl === "/software/report/lead" || currentUrl === "/software/report/sales/delivery" || currentUrl === "/software/report/support" || currentUrl === "/software/report/lead/staff" || currentUrl === "/software/report/sales-delivery/staff" || currentUrl === "/software/report/support/staff" || currentUrl === "/software/report/software/development/staff") {
          if (userGroup === "Easyfis Staff" || userGroup === "Admin") {
          } else if (userGroup === "Delivery Manager") {
            if (currentUrl === "/software/report/lead" || currentUrl === "/software/report/lead/staff") {

            } else {
              this.router.navigate(['/software']);
            }
          } else if (userGroup === "Sales Manager") {
            if (currentUrl === "/software/report/sales/delivery" || currentUrl === "/software/report/sales-delivery/staff") {

            } else {
              this.router.navigate(['/software']);
            }
          } else if (userGroup === "Support Manager") {
            if (currentUrl === "/software/report/support" || currentUrl === "/software/report/support/staff") {

            } else {
              this.router.navigate(['/software']);
            }
          } else {
            this.router.navigate(['/software']);
          }
        } else if (currentUrl === "/software/setup/product" || currentUrl === "/software/setup/product/detail/:id") {
          if (userGroup === "Easyfis Staff" || userGroup === "Admin") {
          } else {
            this.router.navigate(['/software']);
          }
        } else if (currentUrl === "/software/setup/user" || currentUrl === "/software/setup/status") {
          if (userGroup === "Admin") {
          } else {
            this.router.navigate(['/software']);
          }
        } else {
          this.router.navigate(['/software']);
        }
      }
      catch (e) {
        console.log(e);
      }
    }
  }
}