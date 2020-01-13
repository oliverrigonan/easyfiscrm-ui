import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    this.routerEvents();
  }

  public username: String = "";
  public ToolbarTitle: String = "";
  @ViewChild('sidenav') sidenav: MatSidenav;

  public routerEvents(): void {
    this.router.events.subscribe((val) => {
      let toolBarImage: Element = document.getElementById("toolBarImage");
      if (this.router.url == "/software" || this.router.url == "/software/sys/dashboard") {
        this.ToolbarTitle = "Main Menu";
        toolBarImage.setAttribute("src", "../../assets/img/icons/dashboard.png");
      } else if (this.router.url == "/software/trn/lead") {
        this.ToolbarTitle = "Leads";
        toolBarImage.setAttribute("src", "../../assets/img/icons/leads.png");
      } else if (this.router.url.split('/').slice(0, -1).join('/') == "/software/trn/lead/detail") {
        this.ToolbarTitle = "Lead Detail";
        toolBarImage.setAttribute("src", "../../assets/img/icons/leads.png");
      } else if (this.router.url == "/software/trn/sales") {
        this.ToolbarTitle = "Sales Delivery";
        toolBarImage.setAttribute("src", "../../assets/img/icons/delivery.png");
      } else if (this.router.url.split('/').slice(0, -1).join('/') == "/software/trn/sales/detail") {
        this.ToolbarTitle = "Sales Delivery Detail";
        toolBarImage.setAttribute("src", "../../assets/img/icons/delivery.png");
      } else if (this.router.url == "/software/trn/support") {
        this.ToolbarTitle = "Support";
        toolBarImage.setAttribute("src", "../../assets/img/icons/support.png");
      } else if (this.router.url.split('/').slice(0, -1).join('/') == "/software/trn/support/detail") {
        this.ToolbarTitle = "Support Detail";
        toolBarImage.setAttribute("src", "../../assets/img/icons/support.png");
      } else if (this.router.url == "/software/trn/activity") {
        this.ToolbarTitle = "Activity";
        toolBarImage.setAttribute("src", "../../assets/img/icons/activity.png");
      } else if (this.router.url == "/software/report/lead") {
        this.ToolbarTitle = "Lead Report";
        toolBarImage.setAttribute("src", "../../assets/img/icons/report.png");
      } else if (this.router.url == "/software/report/sales/delivery") {
        this.ToolbarTitle = "Sales Delivery Report";
        toolBarImage.setAttribute("src", "../../assets/img/icons/report.png");
      } else if (this.router.url == "/software/report/support") {
        this.ToolbarTitle = "Support Report";
        toolBarImage.setAttribute("src", "../../assets/img/icons/report.png");
      }else if (this.router.url == "/software/report/activity") {
        this.ToolbarTitle = "Activity Report";
        toolBarImage.setAttribute("src", "../../assets/img/icons/report.png");
      }
      else {
        // this.ToolbarTitle = "Easyfis CRM";
      }
    });
  }

  public openSideBar(): void {
    this.sidenav.toggle();
  }

  public signOut(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('token_type');
    localStorage.removeItem('username');

    this.username = "";

    location.reload();
  }

  ngOnInit() {
    this.openSideBar();
    this.username = localStorage.getItem("username");
  }

}
