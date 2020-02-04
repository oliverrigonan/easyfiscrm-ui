import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupportDetailService } from '../support-detail.service';

@Component({
  selector: 'app-support-detail-print-dialog',
  templateUrl: './support-detail-print-dialog.component.html',
  styleUrls: ['./support-detail-print-dialog.component.css']
})
export class SupportDetailPrintDialogComponent implements OnInit {
  
  constructor(
    public supportDetailService: SupportDetailService,
    public casePrintLeadDialogRef: MatDialogRef<SupportDetailPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private toastr: ToastrService
  ) { }

  public printSupportSubscription: any;
  public pdfUrl: string;

  public printCase(): void {
    this.supportDetailService.printLead(this.caseData.objId);
    this.printSupportSubscription = this.supportDetailService.printLeadObservable.subscribe(
      data => {
        var binaryData = [];
        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        let printPDF: Element = document.getElementById("printPDF");
        printPDF.setAttribute("src", this.pdfUrl);

        if (this.printSupportSubscription != null) this.printSupportSubscription.unsubscribe();
      }
    );
  }

  public btnClosePrintDialog(): void {
    this.casePrintLeadDialogRef.close();
    if (this.printSupportSubscription != null) this.printSupportSubscription.unsubscribe();
  }

  public btnPrintSupport(): void {
    window.frames["printPDF"].focus();
    window.frames["printPDF"].print();
  }

  ngOnInit() {
    this.printCase();
  }

  ngOnDestroy() {
    if (this.printSupportSubscription != null) this.printSupportSubscription.unsubscribe();
  }

}
