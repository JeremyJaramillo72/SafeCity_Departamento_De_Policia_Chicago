import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntelService {
  private apiUrl = 'http://localhost:8000/api/criminal';
  constructor(private http: HttpClient) {}
  getGangs(): Observable<any> { return this.http.get(`${this.apiUrl}/gangs/`); }
  createGang(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/gangs/`, data); }
  updateGang(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/gangs/${id}/`, data); }
  deleteGang(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/gangs/${id}/`); }
  getSuspects(): Observable<any> { return this.http.get(`${this.apiUrl}/suspects/`); }
  createSuspect(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/suspects/`, data); }
  updateSuspect(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/suspects/${id}/`, data); }
  deleteSuspect(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/suspects/${id}/`); }
  getEvidences(): Observable<any> { return this.http.get(`${this.apiUrl}/evidence/`); }
  createEvidence(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/evidence/`, data); }
  updateEvidence(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/evidence/${id}/`, data); }
  deleteEvidence(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/evidence/${id}/`); }
  getWitnesses(): Observable<any> { return this.http.get(`${this.apiUrl}/witnesses/`); }
  createWitness(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/witnesses/`, data); }
  updateWitness(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/witnesses/${id}/`, data); }
  deleteWitness(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/witnesses/${id}/`); }
  getVictims(): Observable<any> { return this.http.get(`${this.apiUrl}/victims/`); }
  createVictim(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/victims/`, data); }
  updateVictim(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/victims/${id}/`, data); }
  deleteVictim(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/victims/${id}/`); }
}
