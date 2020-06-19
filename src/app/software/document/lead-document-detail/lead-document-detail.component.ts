import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DocumentModel } from '../document.model';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../document.service';
import { Router } from '@angular/router';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcCore from 'wijmo/wijmo';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-lead-document-detail',
  templateUrl: './lead-document-detail.component.html',
  styleUrls: ['./lead-document-detail.component.css']
})
export class LeadDocumentDetailComponent implements OnInit {

  constructor(private documentService: DocumentService,
    public caseLeadDocumentDialogRef: MatDialogRef<LeadDocumentDetailComponent>,
    private toastr: ToastrService,
    private modalService: BsModalService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private router: Router,
    public sanitizer: DomSanitizer,
    private securityService: SecurityService

  ) { }

  private crmAdmin: boolean = false;

  private cboDocumentTypesObservable: ObservableArray = new ObservableArray();

  private eventName = '';
  private title = '';
  private documentType = '';
  private groupDocument: any;

  private isDocumentLoadingSpinnerHidden: boolean = false;

  private saveDocumentSub: any;

  public docUrl: string;

  private isAddEvent: boolean = false;

  private showFrame: boolean = false;

  showVideoDocument: boolean = false;
  showDocument: boolean = false;

  private documentModel: DocumentModel = {
    Id: 0,
    DocumentName: '',
    DocumentType: '',
    DocumentURL: '',
    DocumentGroup: '',
    DateUploaded: new Date(),
    Particulars: '',
    CreatedByUserId: 0,
    CreatedByUser: '',
    CreatedDateTime: '',
    UpdatedByUserId: 0,
    UpdatedByUser: '',
    UpdatedDateTime: ''
  }

  ngOnInit() {

    setTimeout(() => {
      if (this.securityService.openGroupPage("Admin") == true) {
        this.crmAdmin = true;
      }
    }, 100);
    this.title = this.caseData.objDialogTitle;
    this.eventName = this.caseData.objDialogEvent;
    this.isDocumentLoadingSpinnerHidden = true;
    this.getDocumentTypeList()
  }

  private getDocumentTypeList() {
    let statusObservableArray = new ObservableArray();
    statusObservableArray.push({ docType: 'Document' });
    statusObservableArray.push({ docType: 'Video' });
    this.cboDocumentTypesObservable = statusObservableArray;

    this.getDocumentData();
  }

  private getDocumentData() {
    this.groupDocument = this.caseData.objDialogGroupDocument;

    if (this.eventName == 'edit') {
      this.documentModel = this.caseData.objCaseModel;
    }
    else {
      this.isAddEvent = true;
    }
  }

  private btnSaveDocumentClick(): void {
    let btnSave: Element = document.getElementById("btnSave");
    (<HTMLButtonElement>btnSave).disabled = true;

    this.documentService.saveDocument(this.documentModel, this.groupDocument);
    this.saveDocumentSub = this.documentService.saveDocumentObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully saved.", "Success");
          this.caseLeadDocumentDialogRef.close({ data: 200 });
          (<HTMLButtonElement>btnSave).disabled = false;
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          (<HTMLButtonElement>btnSave).disabled = false;
        }
        if (this.saveDocumentSub != null) this.saveDocumentSub.unsubscribe();
      }
    );
  }

  private btnCloseDocumentDialog(): void {
    this.caseLeadDocumentDialogRef.close({ data: '' });
    if (this.saveDocumentSub != null) this.saveDocumentSub.unsubscribe();
  }


  viewDocumentUrl() {
    try {
      let documentType = this.documentModel.DocumentType;
      let documentUrl = this.documentModel.DocumentURL;

      if (documentType == 'Video') {
        this.showVideoDocument = true;
        this.showDocument = false;
        console.log(documentUrl);
        setTimeout(() => {
          let documentVideoFrame: Element = document.getElementById("documentVideoFrame");
          documentVideoFrame.innerHTML = documentUrl;
        }, 1000);
      }

      if (documentType == 'Document') {
        this.showDocument = true;
        this.showVideoDocument = false;
        setTimeout(() => {
          this.docUrl = documentUrl;
        }, 1000);
      }
    }
    catch (e) {
      this.toastr.error(e, "Error");
    }


  }

}
