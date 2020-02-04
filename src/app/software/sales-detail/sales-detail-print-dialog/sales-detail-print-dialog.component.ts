import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesDetailService } from '../sales-detail.service';

@Component({
  selector: 'app-sales-detail-print-dialog',
  templateUrl: './sales-detail-print-dialog.component.html',
  styleUrls: ['./sales-detail-print-dialog.component.css']
})
export class SalesDetailPrintDialogComponent implements OnInit {

  constructor(
    public salesDeliveryDetailService: SalesDetailService,
    public casePrintSalesDeliveryDialogRef: MatDialogRef<SalesDetailPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private toastr: ToastrService
  ) { }

  public printSalesDeliverySubscription: any;
  public pdfUrl: string;

  public printCase(): void {
    this.salesDeliveryDetailService.printLead(this.caseData.objId);
    this.printSalesDeliverySubscription = this.salesDeliveryDetailService.printLeadObservable.subscribe(
      data => {
        var binaryData = [];
        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        let printPDF: Element = document.getElementById("printPDF");
        printPDF.setAttribute("src", this.pdfUrl);

        if (this.printSalesDeliverySubscription != null) this.printSalesDeliverySubscription.unsubscribe();
      }
    );
  }

  public btnClosePrintDialog(): void {
    this.casePrintSalesDeliveryDialogRef.close();
    if (this.printSalesDeliverySubscription != null) this.printSalesDeliverySubscription.unsubscribe();
  }

  public btnPrintSalesDelivery(): void {
    window.frames["printPDF"].focus();
    window.frames["printPDF"].print();
  }

  ngOnInit() {
    this.printCase();
  }

  ngOnDestroy() {
    if (this.printSalesDeliverySubscription != null) this.printSalesDeliverySubscription.unsubscribe();
  }

}
