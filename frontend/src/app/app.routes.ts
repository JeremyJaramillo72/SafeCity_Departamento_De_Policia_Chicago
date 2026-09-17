import { Routes } from '@angular/router';
import { LoginComponent } from './administracion_seguridad/login/login';
import { ResetPasswordComponent } from './administracion_seguridad/login/reset-password';
import { DashboardComponent } from './gestion_operativa/dashboard/dashboard';
import { IncidentsComponent } from './gestion_operativa/incidents/incidents';
import { IncidentDetailComponent } from './gestion_operativa/incidents/incident-detail/incident-detail';
import { IncidentCreateComponent } from './gestion_operativa/incidents/incident-create/incident-create';
import { IncidentEditComponent } from './gestion_operativa/incidents/incident-edit/incident-edit';
import { LogisticsComponent } from './logistica_patrullaje/logistics/logistics';
import { TacticalMapComponent } from './inteligencia_geografica/tactical-map/tactical-map';
import { CriminalIntelComponent } from './inteligencia_criminal/criminal-intel/criminal-intel';
import { BoloAlertsComponent } from './inteligencia_criminal/bolo-alerts/bolo-alerts';
import { MyCasesComponent } from './investigacion_especial/my-cases/my-cases';
import { AdminUsersComponent } from './administracion_seguridad/users/users';
import { AdminLogsComponent } from './administracion_seguridad/logs/logs';
import { AdminBackupsComponent } from './administracion_seguridad/backups/backups';
import { AdminSettingsComponent } from './administracion_seguridad/settings/settings';
import { AdminCategoriesComponent } from './administracion_seguridad/categories/categories';
import { EmergencyDispatchComponent } from './despacho_emergencias/emergency-dispatch/emergency-dispatch';
import { EmergencyHistoryComponent } from './despacho_emergencias/emergency-history/emergency-history';
import { PatrolIncidentsComponent } from './despacho_emergencias/patrol-incidents/patrol-incidents';
import { TrafficControlComponent } from './gestion_operativa/traffic-control/traffic-control';
import { TowDispatchComponent } from './gestion_operativa/tow-dispatch/tow-dispatch';
import { TrafficAccidentsComponent } from './gestion_operativa/traffic-accidents/traffic-accidents';
import { BookingSystemComponent } from './gestion_operativa/booking-system/booking-system';
import { AuxiliaryReportsComponent } from './gestion_operativa/auxiliary-reports/auxiliary-reports';
import { ArrestsLogComponent } from './gestion_operativa/arrests-log/arrests-log';
import { RoleGuard } from './core/guards/role.guard';
import { RrhhDashboardComponent } from './operativo_rrhh/rrhh-dashboard/rrhh-dashboard.component';
import { OrdenesDashboardComponent } from './ordenes_judiciales/ordenes-dashboard/ordenes-dashboard';
import { RegistrarOrdenComponent } from './ordenes_judiciales/registrar-orden/registrar-orden';
import { EquipoTacticoComponent } from './logistica_patrullaje/equipo-tactico/equipo-tactico';
import { ProfileComponent } from './administracion_seguridad/profile/profile';
import { PortalTransparenciaComponent } from './policia_comunitaria/portal-transparencia/portal-transparencia';
import { RegistrarQuejaComponent } from './policia_comunitaria/registrar-queja/registrar-queja.component';
import { UsoFuerzaComponent } from './policia_comunitaria/uso-fuerza/uso-fuerza.component';
import { DemoOpenspecComponent } from './gestion_operativa/demo-openspec/demo-openspec';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'administrador_sistema', 'recursos_humanos'] } },
  { path: 'demo-openspec', component: DemoOpenspecComponent },
  { path: 'incidents', component: IncidentsComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial'] } },
  { path: 'incidents/new', component: IncidentCreateComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial', 'operador_emergencias'] } },
  { path: 'incidents/:caseNumber/edit', component: IncidentEditComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial', 'operador_emergencias'] } },
  { path: 'incidents/:caseNumber', component: IncidentDetailComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial', 'operador_emergencias'] } },
  { path: 'traffic', component: TrafficControlComponent, canActivate: [RoleGuard], data: { roles: ['agente_transito'] } },
  { path: 'tow-dispatch', component: TowDispatchComponent, canActivate: [RoleGuard], data: { roles: ['agente_transito'] } },
  { path: 'traffic-accidents', component: TrafficAccidentsComponent, canActivate: [RoleGuard], data: { roles: ['agente_transito'] } },
  { path: 'booking', component: BookingSystemComponent, canActivate: [RoleGuard], data: { roles: ['oficial', 'administrador'] } },
  { path: 'arrests-log', component: ArrestsLogComponent, canActivate: [RoleGuard], data: { roles: ['oficial', 'administrador', 'detective'] } },
  { path: 'auxiliary', component: AuxiliaryReportsComponent, canActivate: [RoleGuard], data: { roles: ['oficial', 'administrador'] } },
  { path: 'logistics', component: LogisticsComponent, canActivate: [RoleGuard], data: { roles: ['administrador'] } },
  { path: 'dispatch', component: EmergencyDispatchComponent, canActivate: [RoleGuard], data: { roles: ['operador_emergencias'] } },
  { path: 'dispatch/history', component: EmergencyHistoryComponent, canActivate: [RoleGuard], data: { roles: ['operador_emergencias'] } },
  { path: 'dispatch/patrol-incidents', component: PatrolIncidentsComponent, canActivate: [RoleGuard], data: { roles: ['operador_emergencias', 'administrador', 'oficial', 'jefe_logistica'] } },
  { path: 'tactical-map', component: TacticalMapComponent, canActivate: [RoleGuard], data: { roles: ['administrador'] } },
  { path: 'criminal-intel', component: CriminalIntelComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial'] } },
  { path: 'bolo-alerts', component: BoloAlertsComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial', 'operador_emergencias'] } },
  { path: 'my-cases', component: MyCasesComponent, canActivate: [RoleGuard], data: { roles: ['detective'] } },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [RoleGuard], data: { roles: ['administrador_sistema'] } },
  { path: 'admin/logs', component: AdminLogsComponent, canActivate: [RoleGuard], data: { roles: ['administrador_sistema'] } },
  { path: 'admin/backups', component: AdminBackupsComponent, canActivate: [RoleGuard], data: { roles: ['administrador_sistema'] } },
  { path: 'admin/settings', component: AdminSettingsComponent, canActivate: [RoleGuard], data: { roles: ['administrador_sistema'] } },
  { path: 'rrhh', component: RrhhDashboardComponent, canActivate: [RoleGuard], data: { roles: ['recursos_humanos'] } },
  { path: 'ordenes', component: OrdenesDashboardComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial'] } },
  { path: 'ordenes/registrar', component: RegistrarOrdenComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective'] } },
  { path: 'ordenes/editar/:id', component: RegistrarOrdenComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective'] } },
  { path: 'equipo-tactico', component: EquipoTacticoComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'jefe_logistica', 'comandante', 'administrador_sistema'] } },
  { path: 'profile', component: ProfileComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'detective', 'oficial', 'operador_emergencias', 'recursos_humanos', 'agente_transito', 'administrador_sistema'] } },
  { path: 'transparencia', component: PortalTransparenciaComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'administrador_sistema'] } },
  { path: 'transparencia/queja', component: RegistrarQuejaComponent, canActivate: [RoleGuard], data: { roles: ['administrador', 'administrador_sistema'] } },
  { path: 'transparencia/uso-fuerza', component: UsoFuerzaComponent, canActivate: [RoleGuard], data: { roles: ['oficial', 'detective', 'administrador'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
