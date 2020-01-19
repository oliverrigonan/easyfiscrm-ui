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

  public listUserObservableArray: ObservableArray = new ObservableArray();
  public listUsertCollectionView: CollectionView = new CollectionView(this.listUserObservableArray);
  public listUserPageIndex: number = 15;
  @ViewChild('listUserFlexGrid') listUserFlexGrid: WjFlexGrid;
  public isProgressBarHidden = false;
  public isDataLoaded: boolean = false;

  public listUserSub: any;
  public addUserSubscription: any;

  public userDetailModalRef: BsModalRef;
  public userFormDetailModalRef: BsModalRef;


  public IsAddButtonClick: Boolean;

  public userDetailModalHeaderTitle: string;
  public userFormDetailModalHeaderTitle: string;

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
    ConfirmPassword: ''
  };


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

    this.listUsertCollectionView.pageSize = this.listUserPageIndex;
    this.listUsertCollectionView.refresh();
    this.listUsertCollectionView.refresh();
  }

  public listUserData(): void {
    this.listUserObservableArray = new ObservableArray();
    this.listUsertCollectionView = new CollectionView(this.listUserObservableArray);
    this.listUsertCollectionView.pageSize = 15;
    this.listUsertCollectionView.trackChanges = true;
    this.listUsertCollectionView.refresh();
    this.listUserFlexGrid.refresh();

    this.isProgressBarHidden = false;

    this.userService.listUser();
    this.listUserSub = this.userService.userListObservable.subscribe(
      data => {
        console.log("Fire");
        if (data.length > 0) {
          this.listUserObservableArray = data;
          this.listUsertCollectionView = new CollectionView(this.listUserObservableArray);
          this.listUsertCollectionView.pageSize = this.listUserPageIndex;
          this.listUsertCollectionView.trackChanges = true;
          this.listUsertCollectionView.refresh();
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

    let currentUserDetail = this.listUsertCollectionView.currentItem;
    this.userModel.Id = currentUserDetail.Id;
    this.userModel.UserName = currentUserDetail.UserName;
    this.userModel.FullName = currentUserDetail.FullName;
    this.userModel.Email = currentUserDetail.Email;
    this.userModel.Password = currentUserDetail.Password;

    this.userDetailModalHeaderTitle = "User Detail";
    this.IsAddButtonClick = false;

  }

  public btnAddUserClick(addDetailModalTemplate: TemplateRef<any>): void {
    this.userDetailModalRef = this.modalService.show(addDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-lg"
    });

    this.userDetailModalHeaderTitle = "Add User";
    this.IsAddButtonClick = true;
  }

  public btnAddUserFormClick(addUserFormDetailModalTemplate: TemplateRef<any>): void {
    this.userFormDetailModalRef = this.modalService.show(addUserFormDetailModalTemplate, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm"
    });

    this.userFormDetailModalHeaderTitle = "Add User Form";
    this.IsAddButtonClick = true;
  }


  public btnSaveClick(): void {
    if (this.IsAddButtonClick == true) {
      if (this.userModel.UserName !== "" || this.userModel.FullName !== "" || this.userModel.Email !== "" || this.userModel.Password !== "") {
        this.userService.saveUser(this.userModel);

        this.addUserSubscription = this.userService.saveUserObservable.subscribe(
          data => {
            if (data[0] == "success") {
              this.userDetailModalRef.hide();
              this.toastr.success("User is successfully added.", "Success");
              setTimeout(() => {
                this.isDataLoaded = false;
                this.listUserData();
                this.resetForm();
              }, 100);

            } else if (data[0] == "failed") {
              this.toastr.error(data[1], "Error");
            }
            if (this.addUserSubscription != null) this.addUserSubscription.unsubscribe();
          }
        );
      } else {
        this.toastr.error("Please don't leave empty fields.", "Error");
      }
    } else {
      if (this.userModel.UserName !== "" || this.userModel.FullName !== "" || this.userModel.Email !== "" || this.userModel.Password !== "") {
        this.userService.saveUser(this.userModel);

        this.addUserSubscription = this.userService.saveUserObservable.subscribe(
          data => {
            if (data[0] == "success") {
              this.userDetailModalRef.hide();
              this.toastr.success("Updated successfully.", "Success");
              setTimeout(() => {
                this.isDataLoaded = false;

                this.listUserData();
                this.resetForm();
              }, 100);

            } else if (data[0] == "failed") {
              this.toastr.error(data[1], "Error");
            }
            if (this.addUserSubscription != null) this.addUserSubscription.unsubscribe();
          }
        );
      } else {
        this.toastr.error("Please don't leave empty fields.", "Error");
      }
    }
  }

  public btnCloseModal(): void {
    this.userDetailModalRef.hide();
    this.resetForm();
  }

  public resetForm(): void {
    this.userModel.Id = 0;
    this.userModel.UserName = "";
    this.userModel.FullName = "";
    this.userModel.Email = "";
    this.userModel.Password = "";
  };


}
