import { TestBed } from '@angular/core/testing';

import { LeadDetailService } from './lead-detail.service';

describe('LeadDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeadDetailService = TestBed.get(LeadDetailService);
    expect(service).toBeTruthy();
  });
});
