import { TestBed } from '@angular/core/testing';

import { SalesDeliveryStaffReportService } from './sales-delivery-staff-report.service';

describe('SalesDeliveryStaffReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesDeliveryStaffReportService = TestBed.get(SalesDeliveryStaffReportService);
    expect(service).toBeTruthy();
  });
});
