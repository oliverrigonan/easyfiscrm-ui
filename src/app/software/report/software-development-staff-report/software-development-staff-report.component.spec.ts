import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareDevelopmentStaffReportComponent } from './software-development-staff-report.component';

describe('SoftwareDevelopmentStaffReportComponent', () => {
  let component: SoftwareDevelopmentStaffReportComponent;
  let fixture: ComponentFixture<SoftwareDevelopmentStaffReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareDevelopmentStaffReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareDevelopmentStaffReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
