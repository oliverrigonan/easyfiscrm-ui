import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray } from 'wijmo/wijmo';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { LeadDetailService } from './lead-detail.service';
import { LeadDetailModel } from './lead-detail.model';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export class LeadDetailComponent implements OnInit {

  constructor(
    private leadDetailService: LeadDetailService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  public cboLeadAssignedToUsersSub: any;
  public cboLeadAssignedToUsersObservableArray: ObservableArray = new ObservableArray();

  public detailLeadSub: any;
  public saveLeadSub: any;
  public lockLeadSub: any;
  public unlockLeadSub: any;

  public isLocked: boolean = false;
  public leadDetailModel: LeadDetailModel = {
    Id: 0,
    LDNumber: "",
    LDDate: new Date(),
    Name: "",
    Address: "",
    ContactPerson: "",
    ContactPosition: "",
    ContactEmail: "",
    ContactPhoneNumber: "",
    ReferredBy: "",
    Remarks: "",
    AssignedToUserId: 0,
    AssignedToUser: "",
    Status: "",
    IsLocked: "",
    CreatedByUserId: 0,
    CreatedByUser: "",
    CreatedDateTime: "",
    UpdatedByUserId: 0,
    UpdatedByUser: "",
    UpdatedDateTime: ""
  };

  public cboLeadStatusObservableArray: ObservableArray = new ObservableArray();

  public createCboAssignedToUser() {
    this.leadDetailService.listAssignedUsers();
    this.cboLeadAssignedToUsersSub = this.leadDetailService.listLeadAssignedToUsersObservable.subscribe(
      data => {
        let assignedUsersObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            assignedUsersObservableArray.push({
              Id: data[i].Id,
              UserName: data[i].UserName,
              FullName: data[i].FullName
            });
          }
        }

        this.cboLeadAssignedToUsersObservableArray = assignedUsersObservableArray;
        if (this.cboLeadAssignedToUsersObservableArray.length > 0) {
          this.createCboLeadStatus();
        }

        if (this.cboLeadAssignedToUsersSub != null) this.cboLeadAssignedToUsersSub.unsubscribe();
      }
    );
  }

  public createCboLeadStatus(): void {
    for (let i = 0; i <= 2; i++) {
      let status = "Open";

      switch (i) {
        case 0: {
          status = "Open";
          break;
        }
        case 1: {
          status = "For Closing";
          break;
        }
        case 2: {
          status = "Close";
          break;
        }
        default: {
          break;
        }
      }

      this.cboLeadStatusObservableArray.push({
        Status: status
      });
    }

    setTimeout(() => {
      this.detailLead();
    }, 100);
  }

  public detailLead(): void {
    let id: number = 0;
    this.activatedRoute.params.subscribe(params => { id = params["id"]; });

    this.leadDetailService.detailLead(id);
    this.detailLeadSub = this.leadDetailService.detailLeadObservable.subscribe(
      data => {
        if (data != null) {
          this.leadDetailModel.Id = data.Id;
          this.leadDetailModel.LDNumber = data.LDNumber;
          this.leadDetailModel.LDDate = data.LDDate;
          this.leadDetailModel.Name = data.Name;
          this.leadDetailModel.Address = data.Address;
          this.leadDetailModel.ContactPerson = data.ContactPerson;
          this.leadDetailModel.ContactPosition = data.ContactPosition;
          this.leadDetailModel.ContactEmail = data.ContactEmail;
          this.leadDetailModel.ContactPhoneNumber = data.ContactPhoneNumber;
          this.leadDetailModel.ReferredBy = data.ReferredBy;
          this.leadDetailModel.Remarks = data.Remarks;
          this.leadDetailModel.AssignedToUserId = data.AssignedToUserId;
          this.leadDetailModel.Status = data.Status;
          this.leadDetailModel.IsLocked = data.IsLocked;
          this.leadDetailModel.CreatedByUserId = data.CreatedByUserId;
          this.leadDetailModel.CreatedByUser = data.CreatedByUser;
          this.leadDetailModel.CreatedDateTime = data.CreatedDateTime;
          this.leadDetailModel.UpdatedByUserId = data.UpdatedByUserId;
          this.leadDetailModel.UpdatedByUser = data.UpdatedByUser;
          this.leadDetailModel.UpdatedDateTime = data.UpdatedDateTime;

          let btnSaveLead: Element = document.getElementById("btnSaveLead");
          let btnLockLead: Element = document.getElementById("btnLockLead");
          let btnUnlockLead: Element = document.getElementById("btnUnlockLead");

          (<HTMLButtonElement>btnSaveLead).disabled = false;
          (<HTMLButtonElement>btnLockLead).disabled = false;
          (<HTMLButtonElement>btnUnlockLead).disabled = true;

          if (data.IsLocked) {
            this.isLocked = true;

            (<HTMLButtonElement>btnSaveLead).disabled = true;
            (<HTMLButtonElement>btnLockLead).disabled = true;
            (<HTMLButtonElement>btnUnlockLead).disabled = false;
          }
        }

        if (this.detailLeadSub != null) this.detailLeadSub.unsubscribe();
      }
    );
  }

  public btnSaveLeadClick(): void {
    let btnSaveLead: Element = document.getElementById("btnSaveLead");
    let btnLockLead: Element = document.getElementById("btnLockLead");
    let btnUnlockLead: Element = document.getElementById("btnUnlockLead");
    (<HTMLButtonElement>btnSaveLead).disabled = true;
    (<HTMLButtonElement>btnLockLead).disabled = true;
    (<HTMLButtonElement>btnUnlockLead).disabled = true;

    this.leadDetailService.saveLead(this.leadDetailModel);
    this.saveLeadSub = this.leadDetailService.saveLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully saved.", "Success");

          setTimeout(() => {
            (<HTMLButtonElement>btnSaveLead).disabled = false;
            (<HTMLButtonElement>btnLockLead).disabled = false;
            (<HTMLButtonElement>btnUnlockLead).disabled = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveLead).disabled = false;
          (<HTMLButtonElement>btnLockLead).disabled = false;
          (<HTMLButtonElement>btnUnlockLead).disabled = true;
        }

        if (this.saveLeadSub != null) this.saveLeadSub.unsubscribe();
      }
    );
  }

  public btnLockLeadClick(): void {
    let btnSaveLead: Element = document.getElementById("btnSaveLead");
    let btnLockLead: Element = document.getElementById("btnLockLead");
    let btnUnlockLead: Element = document.getElementById("btnUnlockLead");
    (<HTMLButtonElement>btnSaveLead).disabled = true;
    (<HTMLButtonElement>btnLockLead).disabled = true;
    (<HTMLButtonElement>btnUnlockLead).disabled = true;

    this.leadDetailService.lockLead(this.leadDetailModel);
    this.lockLeadSub = this.leadDetailService.lockLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully locked.", "Success");

          setTimeout(() => {
            this.isLocked = true;

            (<HTMLButtonElement>btnSaveLead).disabled = true;
            (<HTMLButtonElement>btnLockLead).disabled = true;
            (<HTMLButtonElement>btnUnlockLead).disabled = false;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveLead).disabled = false;
          (<HTMLButtonElement>btnLockLead).disabled = false;
          (<HTMLButtonElement>btnUnlockLead).disabled = true;
        }

        if (this.lockLeadSub != null) this.lockLeadSub.unsubscribe();
      }
    );
  }

  public btnUnlockLeadClick(): void {
    let btnSaveLead: Element = document.getElementById("btnSaveLead");
    let btnLockLead: Element = document.getElementById("btnLockLead");
    let btnUnlockLead: Element = document.getElementById("btnUnlockLead");
    (<HTMLButtonElement>btnSaveLead).disabled = true;
    (<HTMLButtonElement>btnLockLead).disabled = true;
    (<HTMLButtonElement>btnUnlockLead).disabled = true;

    this.leadDetailService.unlockLead(this.leadDetailModel);
    this.unlockLeadSub = this.leadDetailService.unlockLeadObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Lead was successfully unlocked.", "Success");

          setTimeout(() => {
            this.isLocked = false;

            (<HTMLButtonElement>btnSaveLead).disabled = false;
            (<HTMLButtonElement>btnLockLead).disabled = false;
            (<HTMLButtonElement>btnUnlockLead).disabled = true;
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnSaveLead).disabled = true;
          (<HTMLButtonElement>btnLockLead).disabled = true;
          (<HTMLButtonElement>btnUnlockLead).disabled = false;
        }

        if (this.unlockLeadSub != null) this.unlockLeadSub.unsubscribe();
      }
    );
  }

  ngOnInit() {
    this.createCboAssignedToUser();
  }

  ngOnDestroy() {
    if (this.cboLeadAssignedToUsersSub != null) this.cboLeadAssignedToUsersSub.unsubscribe();
    if (this.detailLeadSub != null) this.detailLeadSub.unsubscribe();
    if (this.lockLeadSub != null) this.lockLeadSub.unsubscribe();
    if (this.unlockLeadSub != null) this.unlockLeadSub.unsubscribe();
  }
}
