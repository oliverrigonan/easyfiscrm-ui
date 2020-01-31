import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadPrintDialogComponent } from './lead-print-dialog.component';

describe('LeadPrintDialogComponent', () => {
  let component: LeadPrintDialogComponent;
  let fixture: ComponentFixture<LeadPrintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadPrintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
