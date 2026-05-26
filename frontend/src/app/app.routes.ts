import { Routes } from '@angular/router';
import { LoginComponent } from './administracion_seguridad/login/login';
import { DashboardComponent } from './gestion_operativa/dashboard/dashboard';
import { IncidentsComponent } from './gestion_operativa/incidents/incidents';
import { IncidentFormComponent } from './gestion_operativa/incident-form/incident-form';
import { IncidentDetailComponent } from './gestion_operativa/incident-detail/incident-detail';
import { LogisticsComponent } from './logistica_patrullaje/logistics/logistics';
import { TacticalMapComponent } from './inteligencia_geografica/tactical-map/tactical-map';
import { CriminalIntelComponent } from './inteligencia_criminal/criminal-intel/criminal-intel';

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
