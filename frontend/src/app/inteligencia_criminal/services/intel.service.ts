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
  uploadEvidenceImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/evidence/upload/`, formData);
  }
  getWitnesses(): Observable<any> { return this.http.get(`${this.apiUrl}/witnesses/`); }
  createWitness(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/witnesses/`, data); }
  updateWitness(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/witnesses/${id}/`, data); }
  deleteWitness(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/witnesses/${id}/`); }
  getVictims(): Observable<any> { return this.http.get(`${this.apiUrl}/victims/`); }
  createVictim(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/victims/`, data); }
  updateVictim(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/victims/${id}/`, data); }
  deleteVictim(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/victims/${id}/`); }

  getMissingPersons(filters?: any): Observable<any> {
    let params: any = {};
    if (filters) {
      if (filters.estado && !['ALL', 'TODOS', 'TODAS'].includes(filters.estado.toUpperCase())) params.estado = filters.estado;
      if (filters.nivel_riesgo && !['ALL', 'TODOS', 'TODAS'].includes(filters.nivel_riesgo.toUpperCase())) params.nivel_riesgo = filters.nivel_riesgo;
    }
    return this.http.get(`${this.apiUrl}/missing-persons/`, { params });
  }
  createMissingPerson(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/missing-persons/`, data);
  }
  updateMissingPersonStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/missing-persons/${id}/`, { estado: status });
  }
  updateMissingPerson(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/missing-persons/${id}/`, data);
  }
  deleteMissingPerson(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/missing-persons/${id}/`);
  }

  transferEvidenceCustody(id: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/evidence/${id}/transfer/`, data);
  }
  
  getEvidenceCustodyLog(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/evidence/${id}/custody-log/`);
  }

  getBolos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bolo/`);
  }
  
  createBolo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bolo/`, data);
  }

  updateBoloStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/bolo/${id}/`, { estado: status });
  }

  // --- OT13: DIRECTORI0 DE SOSPECHOSOS Y VEHÍCULOS VINCULADOS ---
  getSuspectVehiclesDirectory(filters?: any): Observable<any> {
    let params: any = {};
    if (filters) {
      if (filters.search) params.search = filters.search;
      if (filters.estado && !['ALL', 'TODOS', 'TODAS'].includes(filters.estado.toUpperCase())) params.estado = filters.estado;
    }
    return this.http.get(`${this.apiUrl}/suspects-vehicles/`, { params });
  }

  // --- OT7: REPORTES DE TESTIMONIOS E INCAUTACIONES POR CASO ---
  getCaseEvidenceAndTestimonies(filters?: any): Observable<any> {
    let params = {};
    if (filters) {
      if (filters.case_number) params = { ...params, case_number: filters.case_number };
      if (filters.search) params = { ...params, search: filters.search };
    }
    return this.http.get(`${this.apiUrl}/case-evidence-testimonies/`, { params });
  }
}
