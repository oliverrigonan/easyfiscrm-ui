import { TestBed } from '@angular/core/testing';

import { ActivityReportService } from './activity-report.service';

describe('ActivityReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityReportService = TestBed.get(ActivityReportService);
    expect(service).toBeTruthy();
  });
});
