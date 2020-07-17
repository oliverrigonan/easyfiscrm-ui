import { TestBed } from '@angular/core/testing';

import { SoftwareDevelopmentStaffReportService } from './software-development-staff-report.service';

describe('SoftwareDevelopmentStaffReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoftwareDevelopmentStaffReportService = TestBed.get(SoftwareDevelopmentStaffReportService);
    expect(service).toBeTruthy();
  });
});
