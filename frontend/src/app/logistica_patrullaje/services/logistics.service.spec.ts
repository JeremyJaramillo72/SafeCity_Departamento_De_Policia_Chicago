import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LogisticsService } from './logistics.service';

describe('LogisticsService', () => {
  let service: LogisticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogisticsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LogisticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sanitize status ALL in getPreventiveMaintenance', () => {
    service.getPreventiveMaintenance('', 'ALL').subscribe();
    
    const req = httpMock.expectOne(request => request.url.includes('/api/logistica/mantenimiento-preventivo/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('status')).toBe(false);
    req.flush({ kpis: {}, vehicles: [] });
  });
});
