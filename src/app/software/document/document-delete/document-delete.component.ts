import { Component, OnInit, Inject } from '@angular/core';
import { DocumentModel } from '../document.model';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-delete',
  templateUrl: './document-delete.component.html',
  styleUrls: ['./document-delete.component.css']
})
export class DocumentDeleteComponent implements OnInit {

  constructor(private documentService: DocumentService,
    public caseLeadDocumentDialogRef: MatDialogRef<DocumentDeleteComponent>,
    private toastr: ToastrService,
    private modalService: BsModalService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,) { }

  private eventName = '';
  private title = '';
  private groupDocument: any;

  private isDocumentLoadingSpinnerHidden: boolean = false;

  private deleteDocumentSub: any;

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
    this.title = this.caseData.objDialogTitle;
    this.eventName = this.caseData.objDialogEvent;
    this.groupDocument = this.caseData.objDialogGroupDocument;
    this.isDocumentLoadingSpinnerHidden = true;
    this.documentModel = this.caseData.objCaseModel;
  }

  public btnConfirmDelete() {
    let btnDelete: Element = document.getElementById("btnDelete");
    let btnCloseDialog: Element = document.getElementById("btnCloseDialog");
    (<HTMLButtonElement>btnDelete).disabled = true;
    (<HTMLButtonElement>btnCloseDialog).disabled = true;

    this.documentService.deleteDocument(this.documentModel.Id);
    this.deleteDocumentSub = this.documentService.deleteDocumentObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully deleted.", "Success");
          this.caseLeadDocumentDialogRef.close({ data: 200 });
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          this.caseLeadDocumentDialogRef.close();
          (<HTMLButtonElement>btnDelete).disabled = false;
          (<HTMLButtonElement>btnCloseDialog).disabled = false;
        }

        if (this.deleteDocumentSub != null) this.deleteDocumentSub.unsubscribe();
      }
    );
  }

  public btnCloseDocumentDialog(): void {
    this.caseLeadDocumentDialogRef.close();
    if (this.deleteDocumentSub != null) this.deleteDocumentSub.unsubscribe();
  }

}
