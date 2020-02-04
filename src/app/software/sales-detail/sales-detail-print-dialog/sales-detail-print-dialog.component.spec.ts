import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDetailPrintDialogComponent } from './sales-detail-print-dialog.component';

describe('SalesDetailPrintDialogComponent', () => {
  let component: SalesDetailPrintDialogComponent;
  let fixture: ComponentFixture<SalesDetailPrintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesDetailPrintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDetailPrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
