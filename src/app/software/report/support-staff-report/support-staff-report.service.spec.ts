import { TestBed } from '@angular/core/testing';

import { SupportStaffReportService } from './support-staff-report.service';

describe('SupportStaffReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupportStaffReportService = TestBed.get(SupportStaffReportService);
    expect(service).toBeTruthy();
  });
});
