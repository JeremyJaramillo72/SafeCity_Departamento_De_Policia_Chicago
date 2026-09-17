import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrdenesService } from './ordenes.service';

describe('OrdenesService', () => {
  let service: OrdenesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrdenesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OrdenesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should omit accion param when ALL in getCustodiaDigital', () => {
    service.getCustodiaDigital('', 'ALL').subscribe();
    
    const req = httpMock.expectOne(request => request.url.includes('/api/ordenes/custodia_digital/'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('accion')).toBe(false);
    req.flush([]);
  });
});
