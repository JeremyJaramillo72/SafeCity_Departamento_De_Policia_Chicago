import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8000/api/data';

  constructor(private http: HttpClient) {}

  getDashboardKPIs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/kpis/`);
  }

  getLogisticsDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logistics/dashboard/`);
  }

  getVehicles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logistics/vehicles/`);
  }

  createVehicle(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logistics/vehicles/`, data);
  }

  updateVehicle(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/logistics/vehicles/${id}/`, data);
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/logistics/vehicles/${id}/`);
  }

  // Officers CRUD
  getOfficers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logistics/officers/`);
  }

  createOfficer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logistics/officers/`, data);
  }

  updateOfficer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/logistics/officers/${id}/`, data);
  }

  deleteOfficer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/logistics/officers/${id}/`);
  }

  // Patrol Shifts CRUD
  getPatrolShifts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logistics/patrol-shifts/`);
  }

  createPatrolShift(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/logistics/patrol-shifts/`, data);
  }

  updatePatrolShift(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/logistics/patrol-shifts/${id}/`, data);
  }

  deletePatrolShift(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/logistics/patrol-shifts/${id}/`);
  }

  // Criminal Intelligence CRUD
  getGangs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/intel/gangs/`);
  }
  createGang(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/intel/gangs/`, data);
  }
  updateGang(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/intel/gangs/${id}/`, data);
  }
  deleteGang(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/intel/gangs/${id}/`);
  }

  getSuspects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/intel/suspects/`);
  }
  createSuspect(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/intel/suspects/`, data);
  }
  updateSuspect(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/intel/suspects/${id}/`, data);
  }
  deleteSuspect(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/intel/suspects/${id}/`);
  }

  getEvidences(): Observable<any> {
    return this.http.get(`${this.apiUrl}/intel/evidence/`);
  }
  createEvidence(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/intel/evidence/`, data);
  }
  updateEvidence(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/intel/evidence/${id}/`, data);
  }
  deleteEvidence(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/intel/evidence/${id}/`);
  }

  getWitnesses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/intel/witnesses/`);
  }
  createWitness(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/intel/witnesses/`, data);
  }
  updateWitness(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/intel/witnesses/${id}/`, data);
  }
  deleteWitness(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/intel/witnesses/${id}/`);
  }

  getVictims(): Observable<any> {
    return this.http.get(`${this.apiUrl}/intel/victims/`);
  }
  createVictim(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/intel/victims/`, data);
  }
  updateVictim(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/intel/victims/${id}/`, data);
  }
  deleteVictim(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/intel/victims/${id}/`);
  }

  getIncidents(page: number = 1, limit: number = 10, filters: any = {}): Observable<any> {
    let url = `${this.apiUrl}/incidents/?page=${page}&limit=${limit}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters.date_range) url += `&date_range=${encodeURIComponent(filters.date_range)}`;
    if (filters.district) url += `&district=${encodeURIComponent(filters.district)}`;
    if (filters.type) url += `&type=${encodeURIComponent(filters.type)}`;
    return this.http.get(url);
  }

  getIncidentDetail(caseNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/incidents/${caseNumber}/`);
  }

  createIncident(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidents/create/`, data);
  }

  updateIncident(caseNumber: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/incidents/${caseNumber}/`, data);
  }

  deleteIncident(caseNumber: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/incidents/${caseNumber}/`);
  }

  createIncidentLog(caseNumber: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incidents/${caseNumber}/logs/`, data);
  }

  getCrimes(page: number = 1, limit: number = 1000, filters: any = {}): Observable<any> {
    let url = `${this.apiUrl}/incidents/?page=${page}&limit=${limit}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    return this.http.get(url);
  }
}
