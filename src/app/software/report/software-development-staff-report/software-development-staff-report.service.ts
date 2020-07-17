import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SoftwareDevelopmentStaffReportService {

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

  public async ListUser() {
    return this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/users", this.options);
  }

  public async ListSoftwareDevelopmentStaffReport(startDate: string, endDate: String, userId: number) {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/software/development/staff/" + startDate + "/" + endDate + "/" + userId, this.options);
  }

  public async ListOpenSoftwareDevelopmentStaffReport(startDate: string, endDate: String, userId: number) {
    return await this.httpClient.get(this.defaultAPIURLHost + "/api/crm/report/software/development/staff/open/" + startDate + "/" + endDate + "/" + userId, this.options);
  }
}
