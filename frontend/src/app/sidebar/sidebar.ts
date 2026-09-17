import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { AuthService } from '../administracion_seguridad/services/auth.service';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, Subscription } from 'rxjs';

export interface NavAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
  category: 'ops' | 'intel' | 'legal' | 'rrhh' | 'admin';
  roles: string[]; // empty array means accessible to all authenticated roles
  tags: string[];
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './sidebar.html',
  host: {
    'class': 'block w-full sticky top-0 z-[5000] shrink-0'
  }
})
export class SidebarComponent implements OnInit, OnDestroy {
  profile: string | null = 'oficial';
  activeTab: string = 'asistencias';
  
  // Dropdown & Search state
  activeDropdown: 'ops' | 'intel' | 'legal' | 'rrhh' | 'admin' | 'profile' | 'search' | null = null;
  searchQuery: string = '';
  currentTime: string = '';
  private timer: any;
  private routerSub?: Subscription;
  private roleSub?: Subscription;

  // Master List of Navigational Items Strictly Separated by Server Roles (Spanish UI)
  readonly navActions: NavAction[] = [
    // --- 1. OPERACIONES (CAD, Incidentes, Campo y Flota) ---
    {
      id: 'demo-openspec',
      title: 'Módulo OpenSpec (Incidentes)',
      subtitle: 'Réplica interactiva construida con Spec-Driven Development',
      icon: 'auto_awesome',
      color: 'text-emerald-400',
      route: '/demo-openspec',
      category: 'ops',
      roles: [],
      tags: ['demo', 'openspec', 'incidentes', 'spec-driven', 'evaluacion'],
      badge: 'OPENSPEC'
    },
    {
      id: 'dispatch',
      title: 'Despacho de Emergencias CAD 911',
      subtitle: 'Recepción de llamadas en vivo, consola CAD y patrullas activas',
      icon: 'emergency',
      color: 'text-amber-400',
      route: '/dispatch',
      category: 'ops',
      roles: ['operador_emergencias'],
      tags: ['911', 'despacho', 'cad', 'emergencias', 'llamadas', 'central'],
      badge: 'EN VIVO'
    },
    {
      id: 'dispatch-history',
      title: 'Historial de Despacho 911',
      subtitle: 'Archivo histórico de llamadas de emergencia y reportes',
      icon: 'history',
      color: 'text-slate-400',
      route: '/dispatch/history',
      category: 'ops',
      roles: ['operador_emergencias', 'administrador'],
      tags: ['historial', 'llamadas', 'archivo', 'registros']
    },
    {
      id: 'incidents',
      title: 'Gestión de Casos e Incidentes',
      subtitle: 'Expedientes abiertos, reportes por patrulla y bitácora',
      icon: 'folder_open',
      color: 'text-indigo-400',
      route: '/incidents',
      category: 'ops',
      roles: ['administrador', 'detective', 'oficial', 'operador_emergencias', 'jefe_logistica', 'comandante'],
      tags: ['incidentes', 'casos', 'crímenes', 'delitos', 'reportes', 'patrullas']
    },
    {
      id: 'logistics',
      title: 'Flota y Logística de Patrullas',
      subtitle: 'Telemetría de unidades, combustible y flota vehicular',
      icon: 'directions_car',
      color: 'text-blue-400',
      route: '/logistics',
      category: 'ops',
      roles: ['administrador', 'jefe_logistica', 'comandante'],
      tags: ['flota', 'patrullas', 'vehiculos', 'combustible', 'logistica']
    },
    {
      id: 'booking',
      title: 'Custodia y Registro en Celdas',
      subtitle: 'Ingreso de detenidos, asignación de celdas y custodia',
      icon: 'how_to_reg',
      color: 'text-teal-400',
      route: '/booking',
      category: 'ops',
      roles: ['oficial', 'administrador'],
      tags: ['celdas', 'calabozo', 'detenidos', 'custodia', 'ingreso']
    },
    {
      id: 'arrests-log',
      title: 'Libro Histórico de Arrestos',
      subtitle: 'Historial de detenciones y certificados de custodia legal',
      icon: 'history_edu',
      color: 'text-violet-400',
      route: '/arrests-log',
      category: 'ops',
      roles: ['oficial', 'administrador', 'detective'],
      tags: ['arrestos', 'detenciones', 'historial', 'certificados', 'custodia']
    },
    {
      id: 'traffic-violations',
      title: 'Control de Tránsito y Multas',
      subtitle: 'Infracciones, multas por velocidad y fotomultas',
      icon: 'traffic',
      color: 'text-emerald-400',
      route: '/traffic',
      category: 'ops',
      roles: ['agente_transito'],
      tags: ['transito', 'multas', 'infracciones', 'fotomultas', 'velocidad']
    },
    {
      id: 'tow-dispatch',
      title: 'Despacho de Grúas',
      subtitle: 'Solicitudes de corralón, unidades de grúa y remolques',
      icon: 'local_shipping',
      color: 'text-amber-400',
      route: '/tow-dispatch',
      category: 'ops',
      roles: ['agente_transito'],
      tags: ['gruas', 'corralon', 'vehiculos', 'remolque', 'patio']
    },
    {
      id: 'traffic-accidents',
      title: 'Accidentes de Tránsito',
      subtitle: 'Reportes de colisión, bloqueos viales y peritajes',
      icon: 'car_crash',
      color: 'text-rose-400',
      route: '/traffic-accidents',
      category: 'ops',
      roles: ['agente_transito'],
      tags: ['accidentes', 'choques', 'colisiones', 'peritajes', 'siniestros']
    },

    // --- 2. INTELIGENCIA E INVESTIGACIONES (DIJIN / CID y Mapa Táctico) ---
    {
      id: 'my-cases',
      title: 'Mis Casos Asignados',
      subtitle: 'Cuaderno del detective, investigaciones asignadas y evidencias',
      icon: 'assignment',
      color: 'text-purple-400',
      route: '/my-cases',
      category: 'intel',
      roles: ['detective'],
      tags: ['casos', 'mis casos', 'investigacion', 'detective', 'evidencias']
    },
    {
      id: 'tactical-map',
      title: 'Mapa Táctico Satelital GIS',
      subtitle: 'Inteligencia satelital en alta resolución y rastreo de patrullas',
      icon: 'satellite_alt',
      color: 'text-emerald-400',
      route: '/tactical-map',
      category: 'intel',
      roles: ['administrador', 'detective'],
      tags: ['mapa', 'satelite', 'gis', 'calor', 'geografico']
    },
    {
      id: 'criminal-intel',
      title: 'Inteligencia Criminal y Sospechosos',
      subtitle: 'Expedientes de sospechosos, datos biométricos y redes delictivas',
      icon: 'person_search',
      color: 'text-cyan-400',
      route: '/criminal-intel',
      category: 'intel',
      roles: ['administrador', 'detective', 'oficial'],
      tags: ['inteligencia', 'sospechosos', 'dossier', 'criminal', 'redes', 'perfiles']
    },
    {
      id: 'bolo-alerts',
      title: 'Boletines de Búsqueda B.O.L.O.',
      subtitle: 'Tablero de avisos urgentes para objetivos de alta prioridad',
      icon: 'warning',
      color: 'text-rose-400',
      route: '/bolo-alerts',
      category: 'intel',
      roles: ['administrador', 'detective', 'oficial', 'operador_emergencias'],
      tags: ['bolo', 'alertas', 'buscados', 'urgente', 'captura', 'objetivos'],
      badge: 'URGENTE'
    },
    {
      id: 'equipo-tactico',
      title: 'Armería y Equipamiento Táctico',
      subtitle: 'Armería policial, chalecos antibalas e inventario táctico',
      icon: 'shield',
      color: 'text-amber-400',
      route: '/equipo-tactico',
      category: 'intel',
      roles: ['administrador', 'jefe_logistica', 'comandante'],
      tags: ['armeria', 'armas', 'equipo', 'chalecos', 'tactico', 'pertrechos']
    },

    // --- 3. ÓRDENES JUDICIALES Y TRANSPARENCIA PÚBLICA ---
    {
      id: 'ordenes',
      title: 'Órdenes Judiciales y Allanamientos',
      subtitle: 'Órdenes de jueces, permisos de allanamiento y capturas',
      icon: 'gavel',
      color: 'text-amber-400',
      route: '/ordenes',
      category: 'legal',
      roles: ['administrador', 'detective', 'oficial'],
      tags: ['ordenes', 'warrants', 'jueces', 'allanamientos', 'captura', 'judicial']
    },
    {
      id: 'transparencia',
      title: 'Portal Público de Transparencia',
      subtitle: 'Supervisión ciudadana, estadísticas y rendición de cuentas',
      icon: 'public',
      color: 'text-teal-400',
      route: '/transparencia',
      category: 'legal',
      roles: ['administrador', 'administrador_sistema'],
      tags: ['transparencia', 'publico', 'comunidad', 'rendicion', 'portal']
    },
    {
      id: 'auxiliary-force',
      title: 'Informes de Uso de Fuerza',
      subtitle: 'Auditoría de escalamiento de fuerza e incidentes internos',
      icon: 'security',
      color: 'text-rose-400',
      route: '/transparencia/uso-fuerza',
      category: 'legal',
      roles: ['administrador', 'oficial', 'detective'],
      tags: ['fuerza', 'uso de fuerza', 'auditoria', 'informes', 'reportes']
    },

    // --- 4. PERSONAL Y TALENTO HUMANO (Exclusivo para recursos_humanos) ---
    {
      id: 'rrhh-attendance',
      title: 'Control de Asistencias y Turnos',
      subtitle: 'Marcación biométrica, turnos y horas extra',
      icon: 'schedule',
      color: 'text-purple-400',
      route: '/rrhh?tab=asistencias',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['asistencias', 'turnos', 'reloj', 'rrhh', 'personal', 'horarios']
    },
    {
      id: 'rrhh-leaves',
      title: 'Solicitudes de Permisos y Licencias',
      subtitle: 'Aprobación de licencias médicas, personales y vacaciones',
      icon: 'event_busy',
      color: 'text-pink-400',
      route: '/rrhh?tab=permisos',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['licencias', 'permisos', 'vacaciones', 'rrhh', 'ausencias']
    },
    {
      id: 'rrhh-briefings',
      title: 'Pase de Lista y Briefings',
      subtitle: 'Briefings operacionales diarios y órdenes de misión',
      icon: 'campaign',
      color: 'text-yellow-400',
      route: '/rrhh?tab=briefings',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['briefings', 'pase de lista', 'misiones', 'instrucciones']
    },
    {
      id: 'rrhh-handovers',
      title: 'Protocolos de Relevo y Novedades',
      subtitle: 'Bitácora de entrega de guardia, custodia y relevo de turno',
      icon: 'sync_alt',
      color: 'text-indigo-400',
      route: '/rrhh?tab=handovers',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['relevo', 'entrega', 'turno', 'novedades', 'guardia']
    },
    {
      id: 'rrhh-training',
      title: 'Academia y Entrenamiento Táctico',
      subtitle: 'Calificación de polígono de tiro y certificaciones policiales',
      icon: 'school',
      color: 'text-cyan-400',
      route: '/rrhh?tab=certificaciones',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['capacitaciones', 'entrenamiento', 'academia', 'cursos', 'tiro', 'certificaciones']
    },
    {
      id: 'rrhh-conduct',
      title: 'Conducta y Sanciones Disciplinarias',
      subtitle: 'Expedientes disciplinarios de asuntos internos y sanciones',
      icon: 'gavel',
      color: 'text-rose-400',
      route: '/rrhh?tab=amonestaciones',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['amonestaciones', 'conducta', 'sanciones', 'disciplina', 'asuntos internos']
    },
    {
      id: 'rrhh-dossiers',
      title: 'Hojas de Vida y Expedientes',
      subtitle: 'Historial de servicio del oficial, placas y credenciales',
      icon: 'badge',
      color: 'text-blue-400',
      route: '/rrhh?tab=hojas_vida',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['hojas de vida', 'expedientes', 'oficiales', 'personal', 'dossiers']
    },
    {
      id: 'rrhh-scorecards',
      title: 'Evaluaciones de Rendimiento',
      subtitle: 'Evaluaciones de mérito, conducta y ascensos',
      icon: 'insights',
      color: 'text-emerald-400',
      route: '/rrhh?tab=rendimiento',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['evaluaciones', 'desempeño', 'scorecard', 'meritos', 'ascensos', 'rendimiento']
    },
    {
      id: 'rrhh-community',
      title: 'Vinculación Comunitaria',
      subtitle: 'Reuniones de cuadrante ciudadano y notas de enlace vecinal',
      icon: 'groups',
      color: 'text-teal-400',
      route: '/rrhh?tab=comunidad',
      category: 'rrhh',
      roles: ['recursos_humanos'],
      tags: ['comunidad', 'vecinos', 'reuniones', 'barrios', 'cuadrante']
    },

    // --- 5. ADMINISTRACIÓN DEL SISTEMA (Exclusivo para administrador_sistema) ---
    {
      id: 'admin-users',
      title: 'Usuarios y Control de Acceso',
      subtitle: 'Cuentas de oficiales, roles RBAC y credenciales de seguridad',
      icon: 'manage_accounts',
      color: 'text-blue-400',
      route: '/admin/users',
      category: 'admin',
      roles: ['administrador_sistema'],
      tags: ['usuarios', 'rbac', 'roles', 'permisos', 'accesos']
    },
    {
      id: 'admin-categories',
      title: 'Catálogos y Tipologías',
      subtitle: 'Tipos de delitos, armamento y registro de divisiones',
      icon: 'category',
      color: 'text-indigo-400',
      route: '/admin/categories',
      category: 'admin',
      roles: ['administrador_sistema'],
      tags: ['catalogos', 'categorias', 'configuracion', 'tipos']
    },
    {
      id: 'admin-logs',
      title: 'Bitácora de Auditoría de Seguridad',
      subtitle: 'Trazabilidad del sistema, intentos de acceso y actividad API',
      icon: 'receipt_long',
      color: 'text-teal-400',
      route: '/admin/logs',
      category: 'admin',
      roles: ['administrador_sistema'],
      tags: ['logs', 'auditoria', 'seguridad', 'trazabilidad']
    },
    {
      id: 'admin-backups',
      title: 'Respaldos del Sistema',
      subtitle: 'Copias automatizadas de la BD y recuperación de desastres',
      icon: 'backup',
      color: 'text-cyan-400',
      route: '/admin/backups',
      category: 'admin',
      roles: ['administrador_sistema'],
      tags: ['backups', 'copias', 'respaldos', 'base de datos']
    },
    {
      id: 'admin-settings',
      title: 'Configuración del Sistema',
      subtitle: 'Parámetros globales y configuración de la comandancia',
      icon: 'tune',
      color: 'text-amber-400',
      route: '/admin/settings',
      category: 'admin',
      roles: ['administrador_sistema'],
      tags: ['ajustes', 'configuracion', 'settings', 'sistema']
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole() || localStorage.getItem('role');
    this.roleSub = this.authService.currentRole$.subscribe(r => {
      this.profile = r || localStorage.getItem('role');
    });

    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeAll();
    });
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.roleSub) this.roleSub.unsubscribe();
  }

  private updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('es-CO', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeAll();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeAll();
    }
  }

  toggleDropdown(name: 'ops' | 'intel' | 'legal' | 'rrhh' | 'admin' | 'profile' | 'search', event?: Event) {
    if (event) event.stopPropagation();
    this.activeDropdown = this.activeDropdown === name ? null : name;
  }

  closeAll() {
    this.activeDropdown = null;
    this.searchQuery = '';
  }

  navigateTo(action: NavAction) {
    this.closeAll();
    if (action.route.includes('?')) {
      const [path, query] = action.route.split('?');
      const params: any = {};
      new URLSearchParams(query).forEach((v, k) => params[k] = v);
      this.router.navigate([path], { queryParams: params });
    } else {
      this.router.navigate([action.route]);
    }
  }

  logout() {
    this.closeAll();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get currentRole(): string {
    return this.authService.getRole() || localStorage.getItem('role') || this.profile || 'oficial';
  }

  getRoleLabel(): string {
    switch (this.currentRole) {
      case 'administrador_sistema': return 'ADMIN DE SISTEMA';
      case 'administrador': return 'COMISARIO / JEFE';
      case 'detective': return 'DETECTIVE (DIJIN)';
      case 'operador_emergencias': return 'DESPACHADOR 911';
      case 'recursos_humanos': return 'JEFE DE RRHH';
      case 'agente_transito': return 'AGENTE DE TRÁNSITO';
      case 'comandante': return 'COMANDANTE';
      case 'jefe_logistica': return 'JEFE DE LOGÍSTICA';
      default: return 'OFICIAL DE PATRULLA';
    }
  }

  // --- Category Getters for Navbar (Strict Role-Filtered) ---
  get authorizedActions(): NavAction[] {
    const role = this.currentRole;
    return this.navActions.filter(action => {
      if (!action.roles || action.roles.length === 0) return false;
      return action.roles.includes(role);
    });
  }

  get opsItems(): NavAction[] {
    return this.authorizedActions.filter(a => a.category === 'ops');
  }

  get intelItems(): NavAction[] {
    return this.authorizedActions.filter(a => a.category === 'intel');
  }

  get legalItems(): NavAction[] {
    return this.authorizedActions.filter(a => a.category === 'legal');
  }

  get rrhhItems(): NavAction[] {
    return this.authorizedActions.filter(a => a.category === 'rrhh');
  }

  get adminItems(): NavAction[] {
    return this.authorizedActions.filter(a => a.category === 'admin');
  }

  get hasDashboardAccess(): boolean {
    const r = this.currentRole;
    return r === 'administrador' || r === 'administrador_sistema' || r === 'recursos_humanos';
  }

  get searchResults(): NavAction[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.authorizedActions.filter(action => {
      const titleMatch = action.title.toLowerCase().includes(q);
      const subtitleMatch = action.subtitle.toLowerCase().includes(q);
      const tagMatch = action.tags.some(tag => tag.toLowerCase().includes(q));
      return titleMatch || subtitleMatch || tagMatch;
    });
  }
}
