import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttachmentService } from '../attachment.service';
import { FileAttachmentModel } from '../attachment.model';

@Component({
  selector: 'app-attachment-delete',
  templateUrl: './attachment-delete.component.html',
  styleUrls: ['./attachment-delete.component.css']
})
export class AttachmentDeleteComponent implements OnInit {

  constructor(
    private attachmentService: AttachmentService,
    public caseAttachmentDialogRef: MatDialogRef<AttachmentDeleteComponent>,
    private toastr: ToastrService,
    private modalService: BsModalService,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
  ) { }

  private attachmentModel: FileAttachmentModel = {
    Id: 0,
    SPId: 0,
    Attachment: '',
    AttachmentURL: '',
    AttachmentType: '',
    Particulars: ''
  }


  private eventName = '';
  private title = '';

  private isAttachmentLoadingSpinnerHidden: boolean = false;

  private deleteDocumentSub: any;

  ngOnInit() {
    this.title = this.caseData.objDialogTitle;
    this.eventName = this.caseData.objDialogEvent;
    this.isAttachmentLoadingSpinnerHidden = true;
    this.attachmentModel = this.caseData.objCaseModel;
    console.log(this.attachmentModel.Id);
  }

  
  public btnConfirmDelete() {
    let btnDelete: Element = document.getElementById("btnDelete");
    let btnCloseDialog: Element = document.getElementById("btnCloseDialog");
    (<HTMLButtonElement>btnDelete).disabled = true;
    (<HTMLButtonElement>btnCloseDialog).disabled = true;

    this.attachmentService.deleteAttachment(this.attachmentModel.Id);
    this.deleteDocumentSub = this.attachmentService.deleteAttachmentObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Successfully deleted.", "Success");
          this.caseAttachmentDialogRef.close({ data: 200 });
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");
          this.caseAttachmentDialogRef.close();
          (<HTMLButtonElement>btnDelete).disabled = false;
          (<HTMLButtonElement>btnCloseDialog).disabled = false;
        }

        if (this.deleteDocumentSub != null) this.deleteDocumentSub.unsubscribe();
      }
    );
  }

  public btnCloseDocumentDialog(): void {
    this.caseAttachmentDialogRef.close();
    if (this.deleteDocumentSub != null) this.deleteDocumentSub.unsubscribe();
  }

}
