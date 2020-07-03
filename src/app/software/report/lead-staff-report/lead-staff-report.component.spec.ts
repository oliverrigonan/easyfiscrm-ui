import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadStaffReportComponent } from './lead-staff-report.component';

describe('LeadStaffReportComponent', () => {
  let component: LeadStaffReportComponent;
  let fixture: ComponentFixture<LeadStaffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadStaffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadStaffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
