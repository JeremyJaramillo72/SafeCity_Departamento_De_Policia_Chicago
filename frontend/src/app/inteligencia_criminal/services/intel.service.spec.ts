import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IntelService } from './intel.service';

describe('IntelService', () => {
  let service: IntelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IntelService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(IntelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should omit ALL/TODOS when filtering missing persons', () => {
    service.getMissingPersons({ estado: 'ALL', nivel_riesgo: 'TODOS' }).subscribe();
    
    const req = httpMock.expectOne(request => request.url.includes('/api/criminal/missing-persons/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('estado')).toBe(false);
    expect(req.request.params.has('nivel_riesgo')).toBe(false);
    req.flush([]);
  });
});
