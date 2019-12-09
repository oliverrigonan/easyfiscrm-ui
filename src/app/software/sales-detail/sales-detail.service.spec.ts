import { TestBed } from '@angular/core/testing';

import { SalesDetailService } from './sales-detail.service';

describe('SalesDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesDetailService = TestBed.get(SalesDetailService);
    expect(service).toBeTruthy();
  });
});
