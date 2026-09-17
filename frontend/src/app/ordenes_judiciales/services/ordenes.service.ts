import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'http://localhost:8000/api/ordenes/';

  constructor(private http: HttpClient) {}

  getOrdenes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  registrarOrden(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  verificarOrdenes(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.apiUrl}verificar/`, { params });
  }

  ejecutarOrden(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/ejecutar/`, data);
  }

  buscarSuspects(query: string): Observable<any> {
    return this.http.get(`http://localhost:8000/api/criminal/suspects/?search=${encodeURIComponent(query)}`);
  }

  obtenerOrden(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  actualizarOrden(id: number, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}${id}/`, formData);
  }

  eliminarOrden(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  getCustodiaDigital(search: string = '', accion: string = 'ALL'): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (accion && !['ALL', 'TODOS', 'TODAS'].includes(accion.toUpperCase())) params = params.set('accion', accion);
    return this.http.get(`${this.apiUrl}custodia_digital/`, { params });
  }
}
