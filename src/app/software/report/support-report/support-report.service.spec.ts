import { TestBed } from '@angular/core/testing';

import { SupportReportService } from './support-report.service';

describe('SupportReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupportReportService = TestBed.get(SupportReportService);
    expect(service).toBeTruthy();
  });
});
