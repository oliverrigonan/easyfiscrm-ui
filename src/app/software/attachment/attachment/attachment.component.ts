import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { AttachmentService } from '../attachment.service';
import { FileAttachmentModel } from '../attachment.model';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {

  constructor(
    private attachmentService: AttachmentService,
    public caseAttachmentDialogRef: MatDialogRef<AttachmentComponent>,
    private toastr: ToastrService,
    private modalService: BsModalService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private router: Router,
    public sanitizer: DomSanitizer,
  ) { }

  private attachmentModel: FileAttachmentModel = {
    Id: 0,
    SPId: 0,
    Attachment: '',
    AttachmentURL: '',
    AttachmentType: '',
    Particulars: ''
  }

  private cboDocumentTypesObservable: ObservableArray = new ObservableArray();

  private eventName = '';
  private title = '';
  private AttachmentFile = '';

  private isAttachmentLoadingSpinnerHidden: boolean = false;

  private saveAttachmentSub: any;

  private cboDocumentTypeObservable: any;

  public docUrl: string;
  public imageUrl: string;

  private isAddEvent: boolean = false;

  private showFrame: boolean = false;

  private showVideoDocument: boolean = false;
  private showDocument: boolean = false;
  private showImage: boolean = false;

  public uploadFileSubscription: any;

  private isAllowChoseFile: boolean = true;
  private isUploadButtonDisable: boolean = true;

  ngOnInit() {

    this.title = this.caseData.objDialogTitle;
    this.eventName = this.caseData.objDialogEvent;
    this.isAttachmentLoadingSpinnerHidden = true;
    this.getDocumentTypeList();
    this.checkAttachmentDetail();
  }

  public getDocumentTypeList(): void {
    let documentTypeObservableArray = new ObservableArray();
    this.attachmentService.listDocumentType();
    this.cboDocumentTypeObservable = this.attachmentService.documentTypeObservable.subscribe(
      data => {
        if (data.length > 0) {
          for (var i = 0; i <= data.length - 1; ++i) {
            documentTypeObservableArray.push(data[i]);
          }
        }

        this.cboDocumentTypesObservable = documentTypeObservableArray;


        setTimeout(() => {

        });
        if (this.cboDocumentTypeObservable != null) this.cboDocumentTypeObservable.unsubscribe();
      }
    );
    this.getDocumentData();
  }

  private getDocumentData() {
    if (this.eventName == 'edit') {
      this.attachmentModel = this.caseData.objCaseModel;

      console.log("SupportId: ", this.attachmentModel.SPId);

    }
    else {
      this.attachmentModel.SPId = this.caseData.objCaseModel.SPId;
      console.log("SupportId: ", this.attachmentModel.SPId);

      this.isAddEvent = true;
    }
  }

  private btnSaveAttachmentClick(): void {
    if (this.attachmentModel.Attachment !== '' && this.attachmentModel.AttachmentURL !== '' && this.attachmentModel.AttachmentType !== '') {
      let btnSave: Element = document.getElementById("btnSave");
      (<HTMLButtonElement>btnSave).disabled = true;

      this.attachmentService.saveAttachment(this.attachmentModel);
      this.saveAttachmentSub = this.attachmentService.saveAttachmentObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.toastr.success("Successfully saved.", "Success");
            (<HTMLButtonElement>btnSave).disabled = false;
          } else if (data[0] == "failed") {
            this.toastr.error(data[1], "Error");
            (<HTMLButtonElement>btnSave).disabled = false;
          }
          if (this.saveAttachmentSub != null) this.saveAttachmentSub.unsubscribe();
        }
      );
    } else {
      this.toastr.error("Document, Document Type or Document Url is empty!", "Error");
    }
  }

  private btnCloseDocumentDialog(): void {
    this.caseAttachmentDialogRef.close({ data: 200 });
    if (this.saveAttachmentSub != null) this.saveAttachmentSub.unsubscribe();
  }

  private documentOnChange() {
    this.checkAttachmentDetail();
  }

  checkAttachmentDetail() {
    if (this.attachmentModel.AttachmentType !== '' && this.attachmentModel.Attachment !== '') {
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

  public btnUploadFile(): void {
    let btnUploadFile: Element = document.getElementById("btnUploadFile");
    btnUploadFile.setAttribute("disabled", "disabled");

    let inputFileImage = document.getElementById("inputFileUpload") as HTMLInputElement;

    if (inputFileImage.files.length > 0) {
      this.attachmentService.uploadFile(inputFileImage.files[0], this.attachmentModel.AttachmentType, this.attachmentModel.Attachment);
      this.uploadFileSubscription = this.attachmentService.uploadFileObservable.subscribe(
        data => {
          console.log(data);
          if (data[0] == "success") {
            this.toastr.success("File was successfully uploaded.", "Success");
            btnUploadFile.removeAttribute("disabled");
            this.attachmentModel.AttachmentURL = data[1];
          } else if (data[0] == "failed") {
            this.toastr.error("Unsupported file.", "Error");
            btnUploadFile.removeAttribute("disabled");
          }

          if (this.uploadFileSubscription != null) this.uploadFileSubscription.unsubscribe();
        }
      );
    } else {
      this.toastr.error("No file selected.", "Error");
      btnUploadFile.removeAttribute("disabled");
    }
  }

  viewDocumentUrl() {
    this.imageUrl = '';
    this.showImage = false;
    if (this.attachmentModel.AttachmentType !== '' && this.attachmentModel.AttachmentURL !== '') {
      let documentType = this.attachmentModel.AttachmentType;
      let documentUrl = this.attachmentModel.AttachmentURL;
      this.docUrl = documentUrl;
      window.open(documentUrl);
    } else {
      this.toastr.error("Document Type or Url is empty!", "Error");
    }
  }

}
