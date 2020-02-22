import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SalesDetailService } from '../sales-detail.service';

@Component({
  selector: 'app-sales-delivery-activity-print-dialog',
  templateUrl: './sales-delivery-activity-print-dialog.component.html',
  styleUrls: ['./sales-delivery-activity-print-dialog.component.css']
})
export class SalesDeliveryActivityPrintDialogComponent implements OnInit {

  constructor(
    public salesDeliveryDetailService: SalesDetailService,
    public casePrintSalesDeliveryDialogRef: MatDialogRef<SalesDeliveryActivityPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public caseData: any,
    private toastr: ToastrService
  ) { }

  public printSalesDeliveryActivitySubscription: any;
  public pdfUrl: string;

  public printCase(): void {
    this.salesDeliveryDetailService.printSalesDeliveryActivity(this.caseData.objId);
    this.printSalesDeliveryActivitySubscription = this.salesDeliveryDetailService.printSalesDeliveryActivityObservable.subscribe(
      data => {
        var binaryData = [];
        binaryData.push(data);
        this.pdfUrl = URL.createObjectURL(new Blob(binaryData, { type: "application/pdf" }));

        let printPDF: Element = document.getElementById("printPDF");
        printPDF.setAttribute("src", this.pdfUrl);

        if (this.printSalesDeliveryActivitySubscription != null) this.printSalesDeliveryActivitySubscription.unsubscribe();
      }
    );
  }

  public btnClosePrintDialog(): void {
    this.casePrintSalesDeliveryDialogRef.close();
    if (this.printSalesDeliveryActivitySubscription != null) this.printSalesDeliveryActivitySubscription.unsubscribe();
  }

  public btnPrintSalesDelivery(): void {
    window.frames["printPDF"].focus();
    window.frames["printPDF"].print();
  }

  ngOnInit() {
    this.printCase();
  }

  ngOnDestroy() {
    if (this.printSalesDeliveryActivitySubscription != null) this.printSalesDeliveryActivitySubscription.unsubscribe();
  }

}
