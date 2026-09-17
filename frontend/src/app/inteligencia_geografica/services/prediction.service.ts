import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PredictiveTrendsResponse {
  historical: {
    labels: string[];
    actual: number[];
    trend: number[];
  };
  forecast: {
    labels: string[];
    predicted: number[];
  };
  insights: {
    expected_trend_pct: number;
    direction: 'increase' | 'decrease';
  };
  simulated?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = `${environment.apiUrl}/api/inteligencia`;

  constructor(private http: HttpClient) {}

  getPredictiveTrends(): Observable<PredictiveTrendsResponse> {
    return this.http.get<PredictiveTrendsResponse>(`${this.apiUrl}/predict-trends/`);
  }
}
