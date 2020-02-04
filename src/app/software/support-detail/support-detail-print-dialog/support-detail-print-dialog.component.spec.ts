import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDetailPrintDialogComponent } from './support-detail-print-dialog.component';

describe('SupportDetailPrintDialogComponent', () => {
  let component: SupportDetailPrintDialogComponent;
  let fixture: ComponentFixture<SupportDetailPrintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDetailPrintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDetailPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
