import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadActivityPrintDialogComponent } from './lead-activity-print-dialog.component';

describe('LeadActivityPrintDialogComponent', () => {
  let component: LeadActivityPrintDialogComponent;
  let fixture: ComponentFixture<LeadActivityPrintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadActivityPrintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadActivityPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
