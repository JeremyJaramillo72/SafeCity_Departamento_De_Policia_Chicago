import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogisticsService {
  private apiUrl = 'http://localhost:8000/api/logistica';
  constructor(private http: HttpClient) {}
  getLogisticsDashboard(): Observable<any> { return this.http.get(`${this.apiUrl}/dashboard/`); }
  getVehicles(): Observable<any> { return this.http.get(`${this.apiUrl}/vehicles/`); }
  createVehicle(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/vehicles/`, data); }
  updateVehicle(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/vehicles/${id}/`, data); }
  deleteVehicle(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/vehicles/${id}/`); }
  getOfficers(): Observable<any> { return this.http.get(`${this.apiUrl}/officers/`); }
  createOfficer(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/officers/`, data); }
  updateOfficer(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/officers/${id}/`, data); }
  deleteOfficer(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/officers/${id}/`); }
  getPatrolShifts(): Observable<any> { return this.http.get(`${this.apiUrl}/patrol-shifts/`); }
  createPatrolShift(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/patrol-shifts/`, data); }
  updatePatrolShift(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/patrol-shifts/${id}/`, data); }
  deletePatrolShift(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/patrol-shifts/${id}/`); }
}
