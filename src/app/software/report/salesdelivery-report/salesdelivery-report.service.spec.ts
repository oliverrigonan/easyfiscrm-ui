import { TestBed } from '@angular/core/testing';

import { SalesdeliveryReportService } from './salesdelivery-report.service';

describe('SalesdeliveryReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesdeliveryReportService = TestBed.get(SalesdeliveryReportService);
    expect(service).toBeTruthy();
  });
});
