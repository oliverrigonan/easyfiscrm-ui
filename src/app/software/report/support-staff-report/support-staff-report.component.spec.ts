import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportStaffReportComponent } from './support-staff-report.component';

describe('SupportStaffReportComponent', () => {
  let component: SupportStaffReportComponent;
  let fixture: ComponentFixture<SupportStaffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportStaffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportStaffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
