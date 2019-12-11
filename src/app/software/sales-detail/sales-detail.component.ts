import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { ToastrService } from 'ngx-toastr';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SalesDeliveryDetailModel } from './sales-detail.model';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css']
})
export class SalesDetailComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  public salesDeliveryDetailModel: SalesDeliveryDetailModel = {
    Id: 0,
    SDNumber: "",
    SDDate: new Date(),
    RenewalDate: new Date(),
    CustomerId: 0,
    SIId: 0,
    ProductId: 0,
    LDId: 0,
    ContactPerson: "",
    ContactPosition: "",
    ContactEmail: "",
    ContactPhoneNumber: "",
    Particulars: "",
    AssignedToUserId: 0,
    Status: "",
    IsLocked: false,
    CreatedByUserId: 0,
    CreatedDateTime: new Date(),
    UpdatedByUserId: 0,
    UpdatedDateTime: new Date(),
  }

  ngOnInit() {
  }

}
