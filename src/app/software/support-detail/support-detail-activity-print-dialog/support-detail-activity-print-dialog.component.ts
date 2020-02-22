import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupportDetailService } from '../support-detail.service';

@Component({
  selector: 'app-support-detail-activity-print-dialog',
  templateUrl: './support-detail-activity-print-dialog.component.html',
  styleUrls: ['./support-detail-activity-print-dialog.component.css']
})
export class SupportDetailActivityPrintDialogComponent implements OnInit {

  constructor(
    public supportDetailService: SupportDetailService,
    public casePrintSupportActivityDialogRef: MatDialogRef<SupportDetailActivityPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private toastr: ToastrService
  ) { }

  public printSupportActivitySubscription: any;
  public pdfUrl: string;

  public printCase(): void {
    this.supportDetailService.printSupportActivity(this.caseData.objId);
    this.printSupportActivitySubscription = this.supportDetailService.printSupportActivityObservable.subscribe(
      data => {
        var binaryData = [];
        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        let printPDF: Element = document.getElementById("printPDF");
        printPDF.setAttribute("src", this.pdfUrl);

        if (this.printSupportActivitySubscription != null) this.printSupportActivitySubscription.unsubscribe();
      }
    );
  }

  public btnClosePrintDialog(): void {
    this.casePrintSupportActivityDialogRef.close();
    if (this.printSupportActivitySubscription != null) this.printSupportActivitySubscription.unsubscribe();
  }

  public btnPrintSupportActivity(): void {
    window.frames["printPDF"].focus();
    window.frames["printPDF"].print();
  }

  ngOnInit() {
    this.printCase();
  }

  ngOnDestroy() {
    if (this.printSupportActivitySubscription != null) this.printSupportActivitySubscription.unsubscribe();
  }

}
