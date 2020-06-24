import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentDeleteComponent } from './attachment-delete.component';

describe('AttachmentDeleteComponent', () => {
  let component: AttachmentDeleteComponent;
  let fixture: ComponentFixture<AttachmentDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
