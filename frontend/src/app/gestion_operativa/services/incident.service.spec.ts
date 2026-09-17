import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IncidentService } from './incident.service';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IncidentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sanitize "Todos los Distritos" and not include it as a query param', () => {
    service.getIncidents(1, 10, { district: 'Todos los Distritos', type: 'Todos los Tipos' }).subscribe();
    
    const req = httpMock.expectOne(request => request.url.includes('/api/operativa/incidents/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('district')).toBe(false);
    expect(req.request.params.has('type')).toBe(false);
    req.flush({ data: [], pagination: { total: 0 } });
  });
});
