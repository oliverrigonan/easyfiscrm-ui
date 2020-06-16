import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { UserFormModel } from './user-form.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public cboSysFormObservable: ObservableArray = new ObservableArray();
  public cboGroupObservable: ObservableArray = new ObservableArray();

  public listUserObservableArray: ObservableArray = new ObservableArray();
  public listUserCollectionView: CollectionView = new CollectionView(this.listUserObservableArray);
  public listUserPageIndex: number = 15;
  @ViewChild('listUserFlexGrid') listUserFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public listUserFormObservableArray: ObservableArray = new ObservableArray();
  public listUserFormCollectionView: CollectionView = new CollectionView(this.listUserFormObservableArray);
  public listUserFormPageIndex: number = 15;
  @ViewChild('listUserFormFlexGrid') listUserFormFlexGrid: WjFlexGrid;

  public userDetailModalRef: BsModalRef;
  public userFormDetailModalRef: BsModalRef;
  public userFormDeleteModalRef: BsModalRef;
  public userFormEditModalRef: BsModalRef;

  public userDetailModalHeaderTitle: string;
  public userFormDetailModalHeaderTitle: string;

  public cboSysFormSub: any;
  public cboGroupSub: any;
  public listUserSub: any;
  public addUserSub: any;
  public addUserFormSub: any;
  public deleteUserFormSub: any;
  public listUserFormSub: any;

  public currentUserId: number = 0;
  public IsAddButtonClick: Boolean;

  public cboGroupSelectedValue: string;

  ngOnInit() {
    this.createCboShowNumberOfRows();
    this.listUserData();
  }

  public userModel: UserModel = {
    Id: 0,
    UserName: '',
    FullName: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    CRMUserGroup: ''
  };

  public userFormModel: UserFormModel = {
    Id: 0,
    UserId: 0,
    FormId: 0,
    CanAdd: true,
    CanEdit: true,
    CanDelete: true,
    CanLock: true,
    CanUnlock: true,
    CanCancel: true,
    CanPrint: true
  }

  public createCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";

      if (i == 0) {
        rows = 15;
        rowsString = "Show 15";
      } else if (i == 1) {
        rows = 50;
        rowsString = "Show 50";
      } else if (i == 2) {
        rows = 100;
        rowsString = "Show 100";
      } else if (i == 3) {
        rows = 150;
        rowsString = "Show 150";
      } else {
        rows = 200;
        rowsString = "Show 200";
      }

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.listUserPageIndex = selectedValue;

    this.listUserCollectionView.pageSize = this.listUserPageIndex;
    this.listUserCollectionView.refresh();
    this.listUserCollectionView.refresh();
  }

  public listUserData(): void {
    this.listUserObservableArray = new ObservableArray();
    this.listUserCollectionView = new CollectionView(this.listUserObservableArray);
    this.listUserCollectionView.pageSize = 15;
    this.listUserCollectionView.trackChanges = true;
    this.listUserCollectionView.refresh();
    this.listUserFlexGrid.refresh();

    this.isProgressBarHidden = false;

    this.userService.listUser();
    this.listUserSub = this.userService.userListObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.listUserObservableArray = data;
          this.listUserCollectionView = new CollectionView(this.listUserObservableArray);
          this.listUserCollectionView.pageSize = this.listUserPageIndex;
          this.listUserCollectionView.trackChanges = true;
          this.listUserCollectionView.refresh();
          this.listUserFlexGrid.refresh();
        }
        this.isDataLoaded = true;
        this.isProgressBarHidden = true;

        if (this.listUserSub != null) this.listUserSub.unsubscribe();
      }
    );
  }

  public btnEditUserClick(userDetailModalTemplate: TemplateRef<any>): void {

    this.userDetailModalRef = this.modalService.show(userDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg"
    });


    let currentUserDetail = this.listUserCollectionView.currentItem;
    this.userModel.Id = currentUserDetail.Id;
    this.userModel.UserName = currentUserDetail.UserName;
    this.userModel.FullName = currentUserDetail.FullName;
    this.userModel.Email = currentUserDetail.Email;
    this.userModel.Password = currentUserDetail.Password;
    this.userModel.CRMUserGroup = currentUserDetail.CRMUserGroup;

    this.userDetailModalHeaderTitle = "User Detail";
    this.IsAddButtonClick = false;
    this.currentUserId = currentUserDetail.Id;
    this.userFormModel.UserId = currentUserDetail.Id;

    this.createCboGroup(this.userModel.CRMUserGroup);
  }


  public createCboGroup(group: string): void {
    let groupObservableArray = new ObservableArray();

    groupObservableArray.push({ Group: "Assign Group" });
    this.userService.listGroup();


    this.cboGroupSub = this.userService.groupUserObservable.subscribe(
      data => {
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            groupObservableArray.push(data[i]);
          }
        }
        this.cboGroupObservable = groupObservableArray;

        setTimeout(() => {
          if (group !== null) {
            this.cboGroupSelectedValue = group;
          }
        });
        if (this.cboGroupSub != null) this.cboGroupSub.unsubscribe();
      }
    );
  }

  public cboGroupSelectedIndexChanged(selectedValue: any): void {
    this.userModel.CRMUserGroup = selectedValue;
  }

  public btnAddUserClick(addDetailModalTemplate: TemplateRef<any>): void {
    this.userDetailModalRef = this.modalService.show(addDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg"
    });

    this.userDetailModalHeaderTitle = "Add User";
    this.IsAddButtonClick = true;
    this.userFormModel.UserId = 0;
    this.currentUserId = 0;
    this.listUserFormData();
  }

  public btnAddUserFormClick(addUserFormDetailModalTemplate: TemplateRef<any>): void {
    this.userFormDetailModalRef = this.modalService.show(addUserFormDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });

    this.userFormDetailModalHeaderTitle = "Add User Form";
    this.IsAddButtonClick = true;
    this.createCboSysForm();
  }

  public btnSaveUserClick() {
    let btnUpdateUser: Element = document.getElementById('btnUpdateUser');
    (<HTMLButtonElement>btnUpdateUser).disabled = true;

    if (this.userModel.CRMUserGroup === 'Assign Group') {
      this.userModel.CRMUserGroup = null;
    }

    this.userService.updateUser(this.userModel);

    this.cboGroupSub = this.userService.saveUserObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("User is successfully added.", "Success");
          (<HTMLButtonElement>btnUpdateUser).disabled = false;
          this.listUserData();
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
        }
        if (this.cboGroupSub != null) this.cboGroupSub.unsubscribe();
      }
    );
  }

  public btnLockUserClick(): void {
    if (this.userModel.UserName !== "" || this.userModel.FullName !== "" || this.userModel.Email !== "" || this.userModel.Password !== "") {
      this.userService.saveUser(this.userModel);

      this.addUserSub = this.userService.saveUserObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.userDetailModalRef.hide();
            this.toastr.success("Updated successfully.", "Success");
            setTimeout(() => {
              this.isDataLoaded = false;

              this.listUserData();
              this.resetUserForm();
            }, 100);

          } else if (data[0] == "failed") {
            this.toastr.error(data[1], "Error");
          }
          if (this.addUserSub != null) this.addUserSub.unsubscribe();
        }
      );
    } else {
      this.toastr.error("Please don't leave empty fields.", "Error");
    }
  }

  public createCboSysForm(): void {
    this.userService.listSysForm();
    this.cboSysFormSub = this.userService.sysFormObservable.subscribe(
      data => {
        let sysFormObservableArray = new ObservableArray();
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            sysFormObservableArray.push({
              Id: data[i].Id,
              FormName: data[i].FormName
            });
          }
        }

        this.cboSysFormObservable = sysFormObservableArray;
        if (this.cboSysFormSub != null) this.cboSysFormSub.unsubscribe();
      }
    );
  }

  public cboSysFormSelectedIndexChanged(selectedValue: any): void {
    this.userFormModel.FormId = selectedValue;
  }

  public listUserFormData(): void {
    if (!this.isDataLoaded) {
      setTimeout(() => {
        this.listUserFormObservableArray = new ObservableArray();
        this.listUserFormCollectionView = new CollectionView(this.listUserFormObservableArray);
        this.listUserFormCollectionView.pageSize = 15;
        this.listUserFormCollectionView.trackChanges = true;
        this.listUserFormCollectionView.refresh();
        // this.listUserFormFlexGrid.refresh();

        this.isProgressBarHidden = false;

        this.userService.listUserForm(this.currentUserId);
        this.listUserFormSub = this.userService.userFormListObservable.subscribe(
          data => {
            if (data.length > 0) {
              this.listUserFormObservableArray = data;
              this.listUserFormCollectionView = new CollectionView(this.listUserFormObservableArray);
              this.listUserFormCollectionView.pageSize = this.listUserFormPageIndex;
              this.listUserFormCollectionView.trackChanges = true;
              this.listUserFormCollectionView.refresh();
              // this.listUserFormFlexGrid.refresh();
            }
            this.isDataLoaded = true;
            this.isProgressBarHidden = true;

            if (this.listUserFormSub != null) this.listUserFormSub.unsubscribe();
          }
        );
      }, 100);
    }
  }

  public btnSaveUserFormClick(): void {
    this.userService.SaveUserForm(this.userFormModel);

    this.addUserFormSub = this.userService.saveserFormObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.closeUserFormModal();
          this.toastr.success("Saved successfully.", "Success");
          setTimeout(() => {
            this.isDataLoaded = false;
            this.listUserFormData();
          }, 100);

        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
        }
        if (this.addUserFormSub != null) this.addUserFormSub.unsubscribe();
      }
    );
  }

  public btnEditUserFormClick(editUserFormDetailModalTemplate: TemplateRef<any>): void {
    this.userFormDetailModalRef = this.modalService.show(editUserFormDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
    this.userFormDetailModalHeaderTitle = "Edit User Form";
    this.createCboSysForm();
    setTimeout(() => {
      let currentUserForm = this.listUserFormCollectionView.currentItem;
      this.userFormModel = {
        Id: currentUserForm.Id,
        UserId: currentUserForm.UserId,
        FormId: currentUserForm.FormId,
        CanAdd: currentUserForm.CanAdd,
        CanEdit: currentUserForm.CanEdit,
        CanDelete: currentUserForm.CanDelete,
        CanLock: currentUserForm.CanLock,
        CanUnlock: currentUserForm.CanUnlock,
        CanCancel: currentUserForm.CanCancel,
        CanPrint: currentUserForm.CanPrint,
      }
    }, 100);
  }

  public btnDelteUserFormClick(deleteUserFormDetailModalTemplate: TemplateRef<any>): void {
    this.userFormDeleteModalRef = this.modalService.show(deleteUserFormDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });
  }

  public btnConfirmDeleteUserFormClick(): void {
    let currentUserForm = this.listUserFormCollectionView.currentItem;
    this.userService.DeleteUserForm(currentUserForm.Id);
    this.deleteUserFormSub = this.userService.deleteUserFormObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.userFormDeleteModalRef.hide();
          this.toastr.success("Deleted successfully.", "Success");
          setTimeout(() => {
            this.isDataLoaded = false;
            this.listUserFormData();
          }, 100);

        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
        }
        if (this.deleteUserFormSub != null) this.deleteUserFormSub.unsubscribe();
      }
    );
  }

  public btnCloseModal(): void {
    this.userDetailModalRef.hide();
    this.resetUserForm();
  }

  public listUserForm(): void {
    this.isDataLoaded = false;
    setTimeout(() => {
      this.listUserFormData();
    }, 500);
  }

  public btnCloseUserFormModal(): void {
    this.closeUserFormModal();
  }

  public closeUserFormModal(): void {
    this.userFormDetailModalRef.hide();
    this.resetUserFormForm();
  }

  public resetUserFormForm(): void {
    this.userFormModel.Id = 0;
    this.userFormModel.FormId = 0;
    this.userFormModel.CanAdd = true;
    this.userFormModel.CanEdit = true;
    this.userFormModel.CanDelete = true;
    this.userFormModel.CanLock = true;
    this.userFormModel.CanUnlock = true;
    this.userFormModel.CanCancel = true;
    this.userFormModel.CanPrint = true;
  }

  public resetUserForm(): void {
    this.userModel.Id = 0;
    this.userModel.UserName = "";
    this.userModel.FullName = "";
    this.userModel.Email = "";
    this.userModel.Password = "";
  };

  ngOnDestroy() {
    if (this.listUserSub != null) this.listUserSub.unsubscribe();
    if (this.addUserSub != null) this.addUserSub.unsubscribe();
    if (this.cboGroupSub != null) this.cboGroupSub.unsubscribe();
    if (this.addUserSub != null) this.addUserSub.unsubscribe();
    if (this.addUserSub != null) this.addUserSub.unsubscribe();
    if (this.cboSysFormSub != null) this.cboSysFormSub.unsubscribe();
    if (this.listUserFormSub != null) this.listUserFormSub.unsubscribe();
    if (this.addUserFormSub != null) this.addUserFormSub.unsubscribe();
    if (this.deleteUserFormSub != null) this.deleteUserFormSub.unsubscribe();
  }

}
