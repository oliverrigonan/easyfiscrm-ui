import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDeliveryStaffReportComponent } from './sales-delivery-staff-report.component';

describe('SalesDeliveryStaffReportComponent', () => {
  let component: SalesDeliveryStaffReportComponent;
  let fixture: ComponentFixture<SalesDeliveryStaffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesDeliveryStaffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDeliveryStaffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
