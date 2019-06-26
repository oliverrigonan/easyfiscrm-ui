import { TestBed } from '@angular/core/testing';

import { SalesListService } from './sales-list.service';

describe('SalesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesListService = TestBed.get(SalesListService);
    expect(service).toBeTruthy();
  });
});
