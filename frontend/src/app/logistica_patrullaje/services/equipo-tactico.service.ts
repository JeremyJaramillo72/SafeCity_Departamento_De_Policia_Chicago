import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentTacticoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/logistica';

  // --- Equipment ---
  getEquipment(tipo_equipo?: string, estado_equipo?: string): Observable<any[]> {
    let params: any = {};
    if (tipo_equipo) params.tipo_equipo = tipo_equipo;
    if (estado_equipo) params.estado_equipo = estado_equipo;
    return this.http.get<any[]>(`${this.apiUrl}/equipment/`, { params });
  }

  createEquipment(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/equipment/`, data);
  }

  updateEquipment(id_equipo: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/equipment/${id_equipo}/`, data);
  }

  deleteEquipment(id_equipo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/equipment/${id_equipo}/`);
  }

  assignEquipment(id_equipo: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/equipment/${id_equipo}/assign/`, data);
  }

  returnEquipment(id_equipo: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/equipment/${id_equipo}/return/`, data);
  }

  getAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/equipment-assignments/`);
  }

  // --- Maintenance Tickets ---
  getMaintenanceTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/maintenance/`);
  }

  createMaintenanceTicket(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/maintenance/`, data);
  }

  resolveTicket(id_ticket: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/maintenance/${id_ticket}/`, data);
  }

  updateTicket(id_ticket: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/maintenance/${id_ticket}/`, data);
  }

  deleteTicket(id_ticket: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/maintenance/${id_ticket}/`);
  }

  // --- Vehicle Fleet ---
  getVehicleFleet(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicle-fleet/`);
  }

  createVehicle(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vehicle-fleet/`, data);
  }

  updateVehicle(id_vehiculo: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/vehicle-fleet/${id_vehiculo}/`, data);
  }

  deleteVehicle(id_vehiculo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/vehicle-fleet/${id_vehiculo}/`);
  }
}
