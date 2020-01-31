import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeadDetailService } from '../lead-detail.service';

@Component({
  selector: 'app-lead-print-dialog',
  templateUrl: './lead-print-dialog.component.html',
  styleUrls: ['./lead-print-dialog.component.css']
})
export class LeadPrintDialogComponent implements OnInit {

  constructor(
    public leadDetailService: LeadDetailService,
    public casePrintLeadDialogRef: MatDialogRef<LeadPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private toastr: ToastrService
  ) { }

  public printLeadSubscription: any;
  public pdfUrl: string;

  public printCase(): void {
    this.leadDetailService.printLead(this.caseData.objId);
    this.printLeadSubscription = this.leadDetailService.printLeadObservable.subscribe(
      data => {
        var binaryData = [];
        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        let printPDF: Element = document.getElementById("printPDF");
        printPDF.setAttribute("src", this.pdfUrl);

        if (this.printLeadSubscription != null) this.printLeadSubscription.unsubscribe();
      }
    );
  }

  public btnClosePrintDialog(): void {
    this.casePrintLeadDialogRef.close();
    if (this.printLeadSubscription != null) this.printLeadSubscription.unsubscribe();
  }

  public btnPrintLead(): void {
    window.frames["printPDF"].focus();
    window.frames["printPDF"].print();
  }

  ngOnInit() {
    this.printCase();
  }

  ngOnDestroy() {
    if (this.printLeadSubscription != null) this.printLeadSubscription.unsubscribe();
  }
}
