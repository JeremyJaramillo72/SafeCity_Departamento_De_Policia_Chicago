import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmergencyCall {
  id_llamada: number;
  case_number: string;
  fecha_hora_llamada: string;
  telefono_origen: string;
  id_oficial_despacho: number;
  nivel_prioridad: string;
  descripcion_inicial: string;
  estado: string;
  latitud: number;
  longitud: number;
  direccion: string;
  id_vehiculo: number;
  tiempo_despacho?: string | null;
  tiempo_llegada?: string | null;
  tiempo_resolucion?: string | null;
  dispatcher_name: string;
  vehicle_plate: string;
  vehicle_beat: string;
}

export interface EmergencyKPIs {
  total_today: number;
  pending_calls: number;
  dispatched_calls: number;
  en_sitio_calls: number;
  resolved_today: number;
  avg_dispatch_seconds: number;
  avg_arrival_seconds: number;
  priorities: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private apiUrl = 'http://localhost:8000/api/operativa/emergency-calls/';

  constructor(private http: HttpClient) {}

  getEmergencyCalls(): Observable<EmergencyCall[]> {
    return this.http.get<EmergencyCall[]>(this.apiUrl);
  }

  getEmergencyKPIs(): Observable<{ kpis: EmergencyKPIs }> {
    return this.http.get<{ kpis: EmergencyKPIs }>(`${this.apiUrl}kpis/`);
  }

  createEmergencyCall(callData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, callData);
  }

  dispatchPatrol(callId: number, vehicleId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${callId}/dispatch/`, { id_vehiculo: vehicleId });
  }

  updateCallStatus(callId: number, status: 'en_sitio' | 'resuelto' | 'falsa_alarma', caseNumber = '', createCrimeCase = false): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${callId}/status/`, {
      estado: status,
      case_number: caseNumber,
      create_crime_case: createCrimeCase
    });
  }

  getEmergencyHistory(filters: any): Observable<EmergencyCall[]> {
    let params = '?';
    if (filters.start_date) params += `start_date=${filters.start_date}&`;
    if (filters.end_date) params += `end_date=${filters.end_date}&`;
    if (filters.priority && !['ALL', 'TODOS', 'TODAS'].includes(filters.priority.toUpperCase())) {
      params += `priority=${filters.priority}&`;
    }
    if (filters.status && !['ALL', 'TODOS', 'TODAS'].includes(filters.status.toUpperCase())) {
      params += `status=${filters.status}&`;
    }
    if (filters.search) params += `search=${encodeURIComponent(filters.search)}&`;
    
    return this.http.get<EmergencyCall[]>(`${this.apiUrl}history/${params}`);
  }

  linkCallToIncident(callId: number, caseNumber: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}${callId}/link/`, { case_number: caseNumber });
  }

  getPatrolIncidentsReport(filters: any): Observable<any> {
    let params = '?';
    if (filters.page) params += `page=${filters.page}&`;
    if (filters.limit) params += `limit=${filters.limit}&`;
    if (filters.patrol && !filters.patrol.toLowerCase().includes('todas') && !filters.patrol.toLowerCase().includes('all')) {
      params += `patrol=${encodeURIComponent(filters.patrol)}&`;
    }
    if (filters.status && filters.status !== 'all' && filters.status !== 'Todos') {
      params += `status=${filters.status}&`;
    }
    if (filters.type && !filters.type.toLowerCase().includes('todos') && !filters.type.toLowerCase().includes('all')) {
      params += `type=${encodeURIComponent(filters.type)}&`;
    }
    if (filters.search) params += `search=${encodeURIComponent(filters.search)}&`;
    return this.http.get<any>(`http://localhost:8000/api/operativa/incidents/patrol/${params}`);
  }
}
