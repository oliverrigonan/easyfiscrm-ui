import { Component, OnInit, Inject } from '@angular/core';
import { DocumentModel } from '../document.model';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../document.service';
import { Router } from '@angular/router';

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
  ) { }

  private eventName = '';
  private title = '';
  private groupDocument: any;

  private isDocumentLoadingSpinnerHidden: boolean = false;

  private saveDocumentSub: any;

  public docUrl: string;

  private isAddEvent: boolean = false;

  private documentModel: DocumentModel = {
    Id: 0,
    DocumentName: '',
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
    this.title = this.caseData.objDialogTitle;
    this.eventName = this.caseData.objDialogEvent;
    this.groupDocument = this.caseData.objDialogGroupDocument;

    this.isDocumentLoadingSpinnerHidden = true;
    this.getDocumentData();

  }

  private getDocumentData() {
    if (this.eventName == 'edit') {
      this.documentModel = this.caseData.objCaseModel;
      this.addDocumentUrl();
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

  urlSafe: SafeResourceUrl;

  public btnCloseDocumentDialog(): void {
    this.caseLeadDocumentDialogRef.close();
    if (this.saveDocumentSub != null) this.saveDocumentSub.unsubscribe();
  }

  addDocumentUrl() {
    this.docUrl = this.documentModel.DocumentURL;
    let printPDF: Element = document.getElementById("printDoc");
    printPDF.setAttribute("src", this.docUrl);
  }

  public btnPrintDocument(): void {
    window.frames["printDoc"].print();
  }

}
