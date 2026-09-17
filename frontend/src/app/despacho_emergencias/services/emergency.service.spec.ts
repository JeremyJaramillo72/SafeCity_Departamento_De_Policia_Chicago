import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EmergencyService } from './emergency.service';

describe('EmergencyService', () => {
  let service: EmergencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmergencyService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EmergencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sanitize "ALL" in getEmergencyHistory', () => {
    service.getEmergencyHistory({ priority: 'ALL', status: 'ALL' }).subscribe();
    
    const req = httpMock.expectOne(request => request.url.includes('/api/operativa/emergency-calls/history/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).not.toContain('priority=ALL');
    expect(req.request.urlWithParams).not.toContain('status=ALL');
    req.flush([]);
  });
});
