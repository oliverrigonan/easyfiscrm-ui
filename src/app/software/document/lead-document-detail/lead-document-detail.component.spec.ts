import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDocumentDetailComponent } from './lead-document-detail.component';

describe('LeadDocumentDetailComponent', () => {
  let component: LeadDocumentDetailComponent;
  let fixture: ComponentFixture<LeadDocumentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadDocumentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
