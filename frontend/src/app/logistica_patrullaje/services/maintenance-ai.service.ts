import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AIPrediction {
  probabilidad_falla: number;
  health_score: number;
  nivel_riesgo: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  motivo_principal: string;
}

export interface TelemetryData {
  kilometraje: number;
  dias_desde_servicio: number;
  turnos_completados: number;
}

export interface PredictiveVehicle {
  id_vehiculo: number;
  placa: string;
  tipo: string;
  beat: string;
  estado_actual: string;
  telemetria: TelemetryData;
  ia_prediction: AIPrediction;
}

export interface PredictiveMaintenanceResponse {
  timestamp: string;
  model: string;
  fleet_predictions: PredictiveVehicle[];
}

@Injectable({
  providedIn: 'root'
})
export class MaintenanceAIService {
  private apiUrl = `http://localhost:8000/api/logistica`;

  constructor(private http: HttpClient) {}

  getPredictiveMaintenance(): Observable<PredictiveMaintenanceResponse> {
    return this.http.get<PredictiveMaintenanceResponse>(`${this.apiUrl}/predict-maintenance/`);
  }
}
