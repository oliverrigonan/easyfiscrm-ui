import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDeliveryActivityPrintDialogComponent } from './sales-delivery-activity-print-dialog.component';

describe('SalesDeliveryActivityPrintDialogComponent', () => {
  let component: SalesDeliveryActivityPrintDialogComponent;
  let fixture: ComponentFixture<SalesDeliveryActivityPrintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesDeliveryActivityPrintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDeliveryActivityPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
