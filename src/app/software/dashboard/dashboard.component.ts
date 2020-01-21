import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../security/security.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private crmLead: boolean = false;
  private crmSalesDelivery: boolean = false;
  private crmSupport: boolean = false;
  private crmActivity: boolean = false;
  private crmReport: boolean = false;
  private crmAdmin: boolean = false;
  
  constructor(
    private securityService: SecurityService
  ) { }

  ngOnInit() {
    if (this.securityService.openPage("CRMLead") == true) {
      this.crmLead = true;
    }
    if (this.securityService.openPage("CRMSalesDelivery") == true) {
      this.crmSalesDelivery = true;
    }
    if (this.securityService.openPage("CRMSupport") == true) {
      this.crmSupport = true;
    }
    if (this.securityService.openPage("CRMActivity") == true) {
      this.crmActivity = true;
    }
    if (this.securityService.openPage("CRMReport") == true) {
      this.crmReport = true;
    }
    if (this.securityService.openPage("CRMReport") == true) {
      this.crmReport = true;
    }
    if (this.securityService.openPage("CRMAdmin") == true) {
      this.crmAdmin = true;
    }
  }

}
