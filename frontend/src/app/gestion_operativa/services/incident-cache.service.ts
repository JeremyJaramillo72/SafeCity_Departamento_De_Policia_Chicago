import { Injectable } from '@angular/core';

/**
 * Shared service to pass incident data between list and detail views,
 * avoiding a slow second round-trip to ClickHouse Cloud.
 */
@Injectable({
  providedIn: 'root'
})
export class IncidentCacheService {
  private cachedIncident: any = null;

  set(incident: any): void {
    this.cachedIncident = incident;
  }

  get(): any {
    return this.cachedIncident;
  }

  clear(): void {
    this.cachedIncident = null;
  }
}
