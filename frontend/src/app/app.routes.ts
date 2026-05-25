import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { IncidentsComponent } from './incidents/incidents';
import { IncidentFormComponent } from './incident-form/incident-form';
import { IncidentDetailComponent } from './incident-detail/incident-detail';
import { LogisticsComponent } from './logistics/logistics';
import { TacticalMapComponent } from './tactical-map/tactical-map';
import { CriminalIntelComponent } from './criminal-intel/criminal-intel';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'incidents', component: IncidentsComponent },
  { path: 'incidents/new', component: IncidentFormComponent },
  { path: 'incidents/:caseNumber/edit', component: IncidentFormComponent },
  { path: 'incidents/:caseNumber', component: IncidentDetailComponent },
  { path: 'logistics', component: LogisticsComponent },
  { path: 'tactical-map', component: TacticalMapComponent },
  { path: 'criminal-intel', component: CriminalIntelComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
