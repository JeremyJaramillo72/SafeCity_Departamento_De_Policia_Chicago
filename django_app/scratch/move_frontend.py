import os
import shutil
import re

base_dir = 'C:\\Users\\ASUS\\Documents\\safecity_project\\frontend\\src\\app'

packages = {
    'gestion_operativa': ['incidents', 'incident-form', 'incident-detail', 'dashboard'],
    'inteligencia_geografica': ['tactical-map'],
    'inteligencia_criminal': ['criminal-intel'],
    'logistica_patrullaje': ['logistics'],
    'administracion_seguridad': ['login', 'guards']
}

# 1. Create directories
for pkg in packages.keys():
    os.makedirs(os.path.join(base_dir, pkg), exist_ok=True)
    os.makedirs(os.path.join(base_dir, pkg, 'services'), exist_ok=True)

# 2. Move component folders
for pkg, folders in packages.items():
    for folder in folders:
        src = os.path.join(base_dir, folder)
        dst = os.path.join(base_dir, pkg, folder)
        if os.path.exists(src):
            shutil.move(src, dst)

# 3. Create split services
incident_service_ts = """import { Injectable } from '@angular/core';
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
    if (filters.date_range) url += `&date_range=${encodeURIComponent(filters.date_range)}`;
    if (filters.district) url += `&district=${encodeURIComponent(filters.district)}`;
    if (filters.type) url += `&type=${encodeURIComponent(filters.type)}`;
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
    return this.http.get(url);
  }
}
"""
with open(os.path.join(base_dir, 'gestion_operativa', 'services', 'incident.service.ts'), 'w') as f: f.write(incident_service_ts)

logistics_service_ts = """import { Injectable } from '@angular/core';
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
"""
with open(os.path.join(base_dir, 'logistica_patrullaje', 'services', 'logistics.service.ts'), 'w') as f: f.write(logistics_service_ts)

intel_service_ts = """import { Injectable } from '@angular/core';
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
"""
with open(os.path.join(base_dir, 'inteligencia_criminal', 'services', 'intel.service.ts'), 'w') as f: f.write(intel_service_ts)

# move auth and cache
if os.path.exists(os.path.join(base_dir, 'services', 'auth.service.ts')):
    shutil.move(os.path.join(base_dir, 'services', 'auth.service.ts'), os.path.join(base_dir, 'administracion_seguridad', 'services', 'auth.service.ts'))
    
if os.path.exists(os.path.join(base_dir, 'services', 'incident-cache.service.ts')):
    shutil.move(os.path.join(base_dir, 'services', 'incident-cache.service.ts'), os.path.join(base_dir, 'gestion_operativa', 'services', 'incident-cache.service.ts'))

# delete old services dir
if os.path.exists(os.path.join(base_dir, 'services', 'data.service.ts')):
    os.remove(os.path.join(base_dir, 'services', 'data.service.ts'))
if os.path.exists(os.path.join(base_dir, 'services')):
    shutil.rmtree(os.path.join(base_dir, 'services'))

print("Directories created and components moved successfully.")
