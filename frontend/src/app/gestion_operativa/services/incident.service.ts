import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = 'http://localhost:8000/api/operativa';

  constructor(private http: HttpClient) {}

  getDashboardKPIs(): Observable<any> { return this.http.get(`${this.apiUrl}/dashboard/kpis/`); }
  getIncidents(page: number = 1, limit: number = 10, filters: any = {}): Observable<any> {
    let url = `${this.apiUrl}/incidents/?page=${page}&limit=${limit}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.date_range && !filters.date_range.toLowerCase().includes('historial') && !filters.date_range.toLowerCase().includes('history')) {
      url += `&date_range=${encodeURIComponent(filters.date_range)}`;
    }
    if (filters.district && !filters.district.toLowerCase().includes('todos') && !filters.district.toLowerCase().includes('all')) {
      url += `&district=${encodeURIComponent(filters.district)}`;
    }
    if (filters.type && !filters.type.toLowerCase().includes('todos') && !filters.type.toLowerCase().includes('all')) {
      url += `&type=${encodeURIComponent(filters.type)}`;
    }
    if (filters.patrol && !filters.patrol.toLowerCase().includes('todas') && !filters.patrol.toLowerCase().includes('all')) {
      url += `&patrol=${encodeURIComponent(filters.patrol)}`;
    }
    if (filters.status && filters.status !== 'all' && filters.status !== 'Todos') {
      url += `&status=${encodeURIComponent(filters.status)}`;
    }
    return this.http.get(url);
  }
  getIncidentDetail(caseNumber: string): Observable<any> { return this.http.get(`${this.apiUrl}/incidents/${caseNumber}/`); }
  createIncident(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/incidents/create/`, data); }
  updateIncident(caseNumber: string, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/incidents/${caseNumber}/`, data); }
  deleteIncident(caseNumber: string): Observable<any> { return this.http.delete(`${this.apiUrl}/incidents/${caseNumber}/`); }
  createIncidentLog(caseNumber: string, data: any): Observable<any> { return this.http.post(`${this.apiUrl}/incidents/${caseNumber}/logs/`, data); }
  getCrimes(page: number = 1, limit: number = 1000, filters: any = {}): Observable<any> {
    let url = `${this.apiUrl}/incidents/?page=${page}&limit=${limit}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.year) url += `&year=${filters.year}`;
    if (filters.month) url += `&month=${filters.month}`;
    return this.http.get(url);
  }
}
