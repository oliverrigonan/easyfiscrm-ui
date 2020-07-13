import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DocumentModel } from '../document.model';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../document.service';
import { Router } from '@angular/router';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  constructor(private documentService: DocumentService,
    public caseDocumentDialogRef: MatDialogRef<DocumentComponent>,
    private toastr: ToastrService,
    private modalService: BsModalService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private router: Router,
    public sanitizer: DomSanitizer,
    private securityService: SecurityService

  ) { }

  private isDocumentEditAuthorized: boolean = false;

  private cboDocumentTypesObservable: ObservableArray = new ObservableArray();

  private eventName = '';
  private title = '';
  private documentType = '';
  private groupDocument: any;

  private isDocumentLoadingSpinnerHidden: boolean = false;

  private saveDocumentSub: any;
  private cboDocumentTypeObservable: any;

  public docUrl: string;

  private isAddEvent: boolean = false;

  private showFrame: boolean = false;

  private showVideoDocument: boolean = false;
  private showDocument: boolean = false;

  private isAllowChoseFile: boolean = true;
  private isUploadButtonDisable: boolean = true;
  private AttachmentFile: string = '';

  private uploadFileSub: any;

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
      if (this.securityService.pageTab("Document")) {
        this.isDocumentEditAuthorized = true;
      }
    }, 100);

    this.title = this.caseData.objDialogTitle;
    this.eventName = this.caseData.objDialogEvent;
    this.isDocumentLoadingSpinnerHidden = true;
    this.getDocumentTypeList();
    this.checkAttachmentDetail();
  }

  public getDocumentTypeList(): void {
    let documentTypeObservableArray = new ObservableArray();
    this.documentService.listDocumentType();


    this.cboDocumentTypeObservable = this.documentService.documentTypeObservable.subscribe(
      data => {
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            documentTypeObservableArray.push(data[i]);
          }
        }

        this.cboDocumentTypesObservable = documentTypeObservableArray;
        if (this.cboDocumentTypeObservable != null) this.cboDocumentTypeObservable.unsubscribe();
      }
    );
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
    if (this.documentModel.DocumentName !== '' && this.documentModel.DocumentType !== '' && this.documentModel.DocumentURL !== '') {
      let btnSave: Element = document.getElementById("btnSave");
      (<HTMLButtonElement>btnSave).disabled = true;

      this.documentService.saveDocument(this.documentModel, this.groupDocument);
      this.saveDocumentSub = this.documentService.saveDocumentObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.toastr.success("Successfully saved.", "Success");
            (<HTMLButtonElement>btnSave).disabled = false;
          } else if (data[0] == "failed") {
            this.toastr.error(data[1], "Error");
            (<HTMLButtonElement>btnSave).disabled = false;
          }
          if (this.saveDocumentSub != null) this.saveDocumentSub.unsubscribe();
        }
      );
    } else {
      this.toastr.error("Document, Document Type or Document Url is empty!", "Error");
    }

  }

  private btnCloseDocumentDialog(): void {
    this.caseDocumentDialogRef.close({ data: 200 });
    if (this.saveDocumentSub != null) this.saveDocumentSub.unsubscribe();
    if (this.uploadFileSub != null) this.uploadFileSub.unsubscribe();
  }

  private documentOnChange() {
    this.checkAttachmentDetail();
  }

  checkAttachmentDetail() {
    if (this.documentModel.DocumentType !== '' && this.documentModel.DocumentName !== '') {
      this.isAllowChoseFile = false;
    } else {
      this.isAllowChoseFile = true;
    }
  }

  private documentFileOnChange() {
    if (this.AttachmentFile !== '') {
      this.isUploadButtonDisable = false;
    } else {
      this.isUploadButtonDisable = true;
    }
  }

  viewDocumentUrl() {
    if (this.documentModel.DocumentType !== '' && this.documentModel.DocumentURL !== '') {
      let documentType = this.documentModel.DocumentType;
      let documentUrl = this.documentModel.DocumentURL;
      window.open(documentUrl);
    } else {
      this.toastr.error("Document Type or Url is empty!", "Error");
    }
  }

  public btnUploadFile(): void {
    let btnUploadFile: Element = document.getElementById("btnUploadFile");
    btnUploadFile.setAttribute("disabled", "disabled");

    let inputFileImage = document.getElementById("inputFileUpload") as HTMLInputElement;

    if (inputFileImage.files.length > 0) {
      this.documentService.uploadFile(inputFileImage.files[0], this.documentModel.DocumentType, this.documentModel.DocumentName);
      this.uploadFileSub = this.documentService.uploadFileObservable.subscribe(
        data => {
          console.log(data);
          if (data[0] == "success") {
            this.toastr.success("File was successfully uploaded.", "Success");
            btnUploadFile.removeAttribute("disabled");
            this.documentModel.DocumentURL = data[1];
          } else if (data[0] == "failed") {
            this.toastr.error("Unsupported file.", "Error");
            btnUploadFile.removeAttribute("disabled");
          }

          if (this.uploadFileSub != null) this.uploadFileSub.unsubscribe();
        }
      );
    } else {
      this.toastr.error("No file selected.", "Error");
      btnUploadFile.removeAttribute("disabled");
    }
  }


}
