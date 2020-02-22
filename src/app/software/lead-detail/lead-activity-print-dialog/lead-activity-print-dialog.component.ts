import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeadDetailService } from '../lead-detail.service';

@Component({
  selector: 'app-lead-activity-print-dialog',
  templateUrl: './lead-activity-print-dialog.component.html',
  styleUrls: ['./lead-activity-print-dialog.component.css']
})
export class LeadActivityPrintDialogComponent implements OnInit {

  constructor(
    public leadDetailService: LeadDetailService,
    public casePrintLeadDialogRef: MatDialogRef<LeadActivityPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private toastr: ToastrService
  ) { }

  public printLeadActivitySubscription: any;
  public pdfUrl: string;

  public printCase(): void {
    this.leadDetailService.printLeadActivity(this.caseData.objId);
    this.printLeadActivitySubscription = this.leadDetailService.printLeadActivityObservable.subscribe(
      data => {
        var binaryData = [];
        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        let printPDF: Element = document.getElementById("printPDF");
        printPDF.setAttribute("src", this.pdfUrl);

        if (this.printLeadActivitySubscription != null) this.printLeadActivitySubscription.unsubscribe();
      }
    );
  }

  public btnClosePrintDialog(): void {
    this.casePrintLeadDialogRef.close();
    if (this.printLeadActivitySubscription != null) this.printLeadActivitySubscription.unsubscribe();
  }

  public btnPrintLeadActivity(): void {
    window.frames["printPDF"].focus();
    window.frames["printPDF"].print();
  }

  ngOnInit() {
    this.printCase();
  }

  ngOnDestroy(){
    if (this.printLeadActivitySubscription != null) this.printLeadActivitySubscription.unsubscribe();
  }
}
