import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { SecurityService } from '../security/security.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  public logOutModalRef: BsModalRef;

  private crmLead: boolean = false;
  private crmSalesDelivery: boolean = false;
  private crmSupport: boolean = false;
  private crmActivity: boolean = false;
  private crmReport: boolean = false;
  private crmAdmin: boolean = false;

  constructor(
    private router: Router,
    private modalService: BsModalService,

    private securityService: SecurityService

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
        toolBarImage.setAttribute("src", "../../assets/img/icons/print.png");
      } else if (this.router.url == "/software/report/sales/delivery") {
        this.ToolbarTitle = "Sales Delivery Report";
        toolBarImage.setAttribute("src", "../../assets/img/icons/print.png");
      } else if (this.router.url == "/software/report/support") {
        this.ToolbarTitle = "Support Report";
        toolBarImage.setAttribute("src", "../../assets/img/icons/print.png");
      } else if (this.router.url == "/software/report/activity") {
        this.ToolbarTitle = "Activity Report";
        toolBarImage.setAttribute("src", "../../assets/img/icons/print.png");
      } else if (this.router.url == "/software/setup/user") {
        this.ToolbarTitle = "Users";
        toolBarImage.setAttribute("src", "../../assets/img/icons/woman.png");
      } else if (this.router.url == "/software/setup/product") {
        this.ToolbarTitle = "Products";
        toolBarImage.setAttribute("src", "../../../assets/img/icons/product.png");
      } else if (this.router.url == "/software/setup/status") {
        this.ToolbarTitle = "Status";
        toolBarImage.setAttribute("src", "../../assets/img/icons/status.png");
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
    localStorage.removeItem('userRights');
    localStorage.removeItem('userGroup');
    location.reload();
    this.username = "";
  }

  ngOnInit() {
    this.openSideBar();
    setTimeout(() => {
      this.username = localStorage.getItem("username");
      if (this.securityService.openGroupPage("Lead") == true) {
        this.crmLead = true;
      }
      if (this.securityService.openGroupPage("Delivery") == true) {
        this.crmSalesDelivery = true;
      }
      if (this.securityService.openGroupPage("Support") == true) {
        this.crmSupport = true;
      }
      if (this.securityService.openGroupPage("Activity") == true) {
        this.crmActivity = true;
      }
      if (this.securityService.openGroupPage("Report") == true) {
        this.crmReport = true;
      }
      if (this.securityService.openGroupPage("Admin") == true) {
        this.crmAdmin = true;
      }
    }, 1000);
  }

  public btnSignOutlick(logOutModalTemplate: TemplateRef<any>): void {
    this.logOutModalRef = this.modalService.show(logOutModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
  }

}
