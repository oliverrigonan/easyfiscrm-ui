import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesdeliveryReportComponent } from './salesdelivery-report.component';

describe('SalesdeliveryReportComponent', () => {
  let component: SalesdeliveryReportComponent;
  let fixture: ComponentFixture<SalesdeliveryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesdeliveryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesdeliveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
