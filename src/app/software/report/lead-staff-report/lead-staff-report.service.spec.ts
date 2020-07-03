import { TestBed } from '@angular/core/testing';

import { LeadStaffReportService } from './lead-staff-report.service';

describe('LeadStaffReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeadStaffReportService = TestBed.get(LeadStaffReportService);
    expect(service).toBeTruthy();
  });
});
