import { TestBed } from '@angular/core/testing';

import { SupportDetailService } from './support-detail.service';

describe('SupportDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupportDetailService = TestBed.get(SupportDetailService);
    expect(service).toBeTruthy();
  });
});
