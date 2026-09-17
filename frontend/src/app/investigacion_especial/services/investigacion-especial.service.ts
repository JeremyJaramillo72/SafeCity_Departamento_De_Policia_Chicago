import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvestigacionEspecialService {
  private apiUrl = 'http://localhost:8000/api/investigacion';

  constructor(private http: HttpClient) {}

  assignInvestigation(caseNumber: string, idDetective: number, officerName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign/`, { case_number: caseNumber, id_detective: idDetective, officer_name: officerName });
  }

  escalateInvestigation(caseNumber: string, officerId: number, officerName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/escalate/`, { case_number: caseNumber, officer_id: officerId, officer_name: officerName });
  }

  closeInvestigation(caseNumber: string, reporteFinal: string, officerId: number, officerName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/close/`, { case_number: caseNumber, reporte_final: reporteFinal, officer_id: officerId, officer_name: officerName });
  }

  reopenInvestigation(caseNumber: string, razon: string, officerId: number, officerName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reopen/`, { case_number: caseNumber, razon: razon, officer_id: officerId, officer_name: officerName });
  }

  getMyInvestigations(idDetective: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-cases/?id_detective=${idDetective}`);
  }

  downloadCaseReport(caseNumber: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${caseNumber}/report/`, { responseType: 'blob' });
  }

  solicitarAsignacion(caseNumber: string, idDetective: number, nombreDetective: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar/`, { case_number: caseNumber, id_detective: idDetective, nombre_detective: nombreDetective });
  }

  obtenerSolicitudes(estado?: string, idDetective?: number): Observable<any> {
    let url = `${this.apiUrl}/solicitudes/?`;
    if (estado) url += `estado=${estado}&`;
    if (idDetective) url += `id_detective=${idDetective}`;
    return this.http.get(url);
  }

  resolverSolicitud(idSolicitud: string, accion: string, idSheriff: number, nombreSheriff: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitudes/${idSolicitud}/resolver/`, { accion, id_sheriff: idSheriff, nombre_sheriff: nombreSheriff });
  }
}
