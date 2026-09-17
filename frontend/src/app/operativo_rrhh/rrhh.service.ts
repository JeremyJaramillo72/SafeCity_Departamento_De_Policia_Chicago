import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClockRecord {
  id: string;
  id_oficial: number;
  timestamp_entrada: string;
  timestamp_salida: string | null;
}

export interface SolicitudPermiso {
  id?: string;
  id_oficial: number;
  tipo_permiso: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado?: string;
  id_comandante_aprobador?: number;
  documento_respaldo?: string;
}



@Injectable({
  providedIn: 'root'
})
export class RrhhService {
  private apiUrl = 'http://localhost:8000/api/rrhh';

  constructor(private http: HttpClient) {}

  clockIn(idOfficer: number): Observable<ClockRecord> {
    return this.http.post<ClockRecord>(`${this.apiUrl}/clock-in/`, { id_oficial: idOfficer });
  }

  clockOut(idOfficer: number): Observable<ClockRecord> {
    return this.http.post<ClockRecord>(`${this.apiUrl}/clock-out/`, { id_oficial: idOfficer });
  }

  solicitarPermiso(permiso: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/permiso/`, permiso);
  }

  getPermisos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/permisos/`);
  }

  getAsistencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/asistencias/`);
  }

  aprobarPermiso(id: string | number, aprobado: boolean): Observable<any> {
    const estado = aprobado ? 'Approved' : 'Rejected';
    return this.http.put(`${this.apiUrl}/permiso/${id}/aprobar/`, { estado });
  }



  getAmonestaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/amonestacion/`);
  }

  createAmonestacion(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/amonestacion/`, data);
  }

  getCertificaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/certificacion/`);
  }

  createCertificacion(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/certificacion/`, data);
  }

  getBriefings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/briefings/`);
  }

  createBriefing(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/briefings/`, data);
  }

  getHandovers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/handovers/`);
  }

  createHandover(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/handovers/`, data);
  }

  confirmHandover(id: string | number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/handover/${id}/confirmar/`, {});
  }

  getMeetings(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/operativa/community-meetings/');
  }

  createMeeting(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/operativa/community-meetings/', data);
  }

  getOfficerPerformance(idOficial?: number): Observable<any> {
    const url = idOficial 
      ? `${this.apiUrl}/officer-performance/?id_oficial=${idOficial}`
      : `${this.apiUrl}/officer-performance/`;
    return this.http.get<any>(url);
  }
}
