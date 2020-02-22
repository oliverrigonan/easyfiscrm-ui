import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDetailActivityPrintDialogComponent } from './support-detail-activity-print-dialog.component';

describe('SupportDetailActivityPrintDialogComponent', () => {
  let component: SupportDetailActivityPrintDialogComponent;
  let fixture: ComponentFixture<SupportDetailActivityPrintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDetailActivityPrintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDetailActivityPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
