import { TestBed } from '@angular/core/testing';

import { LeadReportService } from './lead-report.service';

describe('LeadReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeadReportService = TestBed.get(LeadReportService);
    expect(service).toBeTruthy();
  });
});
