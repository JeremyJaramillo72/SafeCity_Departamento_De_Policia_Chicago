import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BurnoutPrediction {
  probabilidad_burnout: number;
  nivel_estres: 'CRITICAL' | 'WARNING' | 'OPTIMAL';
  motivo_principal: string;
}

export interface HRTelemetryData {
  turnos_30d: number;
  horas_overtime: number;
  dias_sin_vacaciones: number;
}

export interface IAOfficer {
  id_oficial: number;
  placa_policial: string;
  nombre_completo: string;
  telemetria: HRTelemetryData;
  ia_prediction: BurnoutPrediction;
}

export interface PredictBurnoutResponse {
  timestamp: string;
  model: string;
  burnout_predictions: IAOfficer[];
}

@Injectable({
  providedIn: 'root'
})
export class HrAIService {
  private apiUrl = `http://localhost:8000/api/logistica`;

  constructor(private http: HttpClient) {}

  getPredictBurnout(): Observable<PredictBurnoutResponse> {
    return this.http.get<PredictBurnoutResponse>(`${this.apiUrl}/predict-burnout/`);
  }
}
