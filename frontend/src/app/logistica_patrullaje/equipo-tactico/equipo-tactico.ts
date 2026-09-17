import { RouterLink } from '@angular/router';
import { AuthService } from '../../administracion_seguridad/services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EquipmentTacticoService } from '../services/equipo-tactico.service';
import { SidebarComponent } from '../../sidebar/sidebar';

@Component({
  selector: 'app-equipo-tactico',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SidebarComponent, RouterLink],
  templateUrl: './equipo-tactico.html'
})
export class EquipoTacticoComponent implements OnInit {
  showProfileDropdown = false;

  constructor(public authService: AuthService) {}

  private service = inject(EquipmentTacticoService);
  private http = inject(HttpClient);
  
  activeTab = 'inventory'; // inventory | tickets | log
  showKpis = true;

  toggleKpis() {
    this.showKpis = !this.showKpis;
  }
  
  searchQuery: string = '';

  get filteredEquipment(): any[] {
    if (!this.equipment) return [];
    if (!this.searchQuery?.trim()) return this.equipment;
    const q = this.searchQuery.toLowerCase().trim();
    return this.equipment.filter(e => 
      (e.codigo_serial || '').toLowerCase().includes(q) ||
      (e.tipo_equipo || '').toLowerCase().includes(q) ||
      (e.marca_modelo || '').toLowerCase().includes(q) ||
      (e.estado_equipo || '').toLowerCase().includes(q) ||
      (e.nombre_oficial_actual || '').toLowerCase().includes(q)
    );
  }

  get filteredMaintenanceTickets(): any[] {
    if (!this.maintenanceTickets) return [];
    if (!this.searchQuery?.trim()) return this.maintenanceTickets;
    const q = this.searchQuery.toLowerCase().trim();
    return this.maintenanceTickets.filter(t => 
      (t.placa_vehiculo || '').toLowerCase().includes(q) ||
      (t.tipo_falla || '').toLowerCase().includes(q) ||
      (t.estado_ticket || '').toLowerCase().includes(q) ||
      (t.prioridad || '').toLowerCase().includes(q)
    );
  }

  get filteredAssignments(): any[] {
    if (!this.assignments) return [];
    if (!this.searchQuery?.trim()) return this.assignments;
    const q = this.searchQuery.toLowerCase().trim();
    return this.assignments.filter(a => 
      (a.codigo_serial || '').toLowerCase().includes(q) ||
      (a.tipo_equipo || '').toLowerCase().includes(q) ||
      (a.nombre_oficial || '').toLowerCase().includes(q) ||
      (a.tipo_accion || '').toLowerCase().includes(q)
    );
  }

  equipment: any[] = [];
  sortFieldEquipment = '';
  sortAscendingEquipment = true;
  
  maintenanceTickets: any[] = [];
  sortFieldTicket = '';
  sortAscendingTicket = true;
  
  assignments: any[] = [];
  sortFieldAssignment = '';
  sortAscendingAssignment = true;
  vehicles: any[] = [];
  officers: any[] = []; 

  // --- Modal States ---
  showAssignModal = false;
  showReturnModal = false;
  showResolveModal = false;
  
  // CRUD Modals
  showEquipmentModal = false;
  showTicketModal = false;

  // Selected Entities
  selectedEquipment: any = null;
  selectedTicket: any = null;
  
  // --- Form States ---
  assignForm = { id_oficial: '', nombre_oficial: '', observaciones: '' };
  returnForm = { observaciones: '', estado_equipo: 'AVAILABLE' };
  resolveForm = { observaciones: '' };

  // CRUD Forms
  isEditingEquipment = false;
  equipmentForm: any = { 
    id_equipo: '', 
    codigo_serial: '', 
    tipo_equipo: 'OTRO', 
    marca_modelo: '', 
    notas: '',
    fecha_adquisicion: new Date().toISOString().split('T')[0],
    condicion: 'NUEVO',
    ubicacion: 'ARMERIA_CENTRAL',
    tipo_arma: 'PISTOLA',
    calibre: '',
    nivel_proteccion: 'NIJ_IIIA',
    fecha_caducidad: '',
    frecuencia: 'TETRA',
    tiene_gps: 'SI'
  };

  isEditingTicket = false;
  ticketForm = { id_ticket: '', id_vehiculo: '', placa_vehiculo: '', categoria_falla: '', descripcion: '', gravedad: 'LOW' };

  Math = Math;

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loadEquipment();
    this.loadTickets();
    this.loadAssignments();
    this.loadVehicles();
    this.loadOfficers();
  }

  loadEquipment() {
    this.service.getEquipment().subscribe(res => {
      this.equipment = res;
      this.applyEquipmentSort();
    });
  }

  loadTickets() {
    this.service.getMaintenanceTickets().subscribe(res => {
      this.maintenanceTickets = res;
      this.applyTicketSort();
    });
  }

  loadAssignments() {
    this.service.getAssignments().subscribe(res => {
      this.assignments = res;
      this.applyAssignmentSort();
    });
  }

  // Equipment sorting methods
  sortEquipment(field: string) {
    if (this.sortFieldEquipment === field) {
      this.sortAscendingEquipment = !this.sortAscendingEquipment;
    } else {
      this.sortFieldEquipment = field;
      this.sortAscendingEquipment = true;
    }
    this.applyEquipmentSort();
  }
  applyEquipmentSort() {
    if (!this.sortFieldEquipment) return;
    const field = this.sortFieldEquipment;
    const direction = this.sortAscendingEquipment ? 1 : -1;
    this.equipment.sort((a, b) => {
      const valA = (a[field] || '').toString().toLowerCase();
      const valB = (b[field] || '').toString().toLowerCase();
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  // Tickets sorting methods
  sortTickets(field: string) {
    if (this.sortFieldTicket === field) {
      this.sortAscendingTicket = !this.sortAscendingTicket;
    } else {
      this.sortFieldTicket = field;
      this.sortAscendingTicket = true;
    }
    this.applyTicketSort();
  }
  applyTicketSort() {
    if (!this.sortFieldTicket) return;
    const field = this.sortFieldTicket;
    const direction = this.sortAscendingTicket ? 1 : -1;
    this.maintenanceTickets.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_creacion') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  // Assignments sorting methods
  sortAssignments(field: string) {
    if (this.sortFieldAssignment === field) {
      this.sortAscendingAssignment = !this.sortAscendingAssignment;
    } else {
      this.sortFieldAssignment = field;
      this.sortAscendingAssignment = true;
    }
    this.applyAssignmentSort();
  }
  applyAssignmentSort() {
    if (!this.sortFieldAssignment) return;
    const field = this.sortFieldAssignment;
    const direction = this.sortAscendingAssignment ? 1 : -1;
    this.assignments.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];
      if (field === 'fecha_registro') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }
      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  loadVehicles() {
    this.service.getVehicleFleet().subscribe(res => this.vehicles = res);
  }
  
  loadOfficers() {
    fetch('http://localhost:8000/api/logistica/officers/')
      .then(res => res.json())
      .then(data => this.officers = data)
      .catch(err => console.error(err));
  }

  get availableEquipment() { return this.equipment.filter(e => e.estado_equipo === 'AVAILABLE' || e.estado_equipo === 'DISPONIBLE').length; }
  get assignedEquipment() { return this.equipment.filter(e => e.estado_equipo === 'ASSIGNED' || e.estado_equipo === 'ASIGNADO').length; }
  get maintenanceEquipment() { return this.equipment.filter(e => e.estado_equipo === 'EN_MANTENIMIENTO' || e.estado_equipo === 'IN_MAINTENANCE' || e.estado_equipo === 'MANTENIMIENTO').length; }

  // --- Equipment CRUD ---
  openCreateEquipmentModal() {
    this.isEditingEquipment = false;
    this.loadOfficers();
    this.equipmentForm = { 
      id_equipo: '', codigo_serial: '', tipo_equipo: 'OTRO', marca_modelo: '', notas: '',
      id_oficial_actual: null, nombre_oficial_actual: '',
      fecha_adquisicion: new Date().toISOString().split('T')[0], condicion: 'NUEVO', ubicacion: 'ARMERIA_CENTRAL',
      tipo_arma: 'PISTOLA', calibre: '', nivel_proteccion: 'NIJ_IIIA', fecha_caducidad: '', frecuencia: 'TETRA', tiene_gps: 'SI' 
    };
    this.showEquipmentModal = true;
    this.onTypeEquipmentChange();
  }

  onTypeEquipmentChange() {
    if (this.isEditingEquipment) return;
    const t = this.equipmentForm.tipo_equipo;
    if (!t) return;
    
    this.http.get<any>(`http://localhost:8000/api/logistica/equipment/next-serial/?tipo_equipo=${t}`).subscribe({
      next: (res) => {
        if (res && res.next_serial) {
          this.equipmentForm.codigo_serial = res.next_serial;
          this.equipmentForm.id_equipo = res.next_serial;
        }
      },
      error: (err) => {
        console.error('Error generating serial:', err);
      }
    });
  }

  openEditEquipmentModal(eq: any) {
    this.isEditingEquipment = true;
    this.loadOfficers();
    this.equipmentForm = { 
      fecha_adquisicion: new Date().toISOString().split('T')[0], condicion: 'NUEVO', ubicacion: 'ARMERIA_CENTRAL',
      tipo_arma: 'PISTOLA', calibre: '', nivel_proteccion: 'NIJ_IIIA', fecha_caducidad: '', frecuencia: 'TETRA', tiene_gps: 'SI',
      ...eq 
    };
    this.showEquipmentModal = true;
  }

  submitEquipment() {
    const dataToSend = { ...this.equipmentForm };
    
    // Inject current user
    dataToSend.creado_por = localStorage.getItem('officer_name') || 'System';

    if (dataToSend.id_oficial_actual) {
      const ofc = this.officers.find(o => o.id_oficial == dataToSend.id_oficial_actual);
      if (ofc) {
        dataToSend.nombre_oficial_actual = `${ofc.nombres} ${ofc.apellidos}`;
      }
      dataToSend.estado_equipo = 'ASIGNADO';
    } else {
      dataToSend.id_oficial_actual = null;
      dataToSend.nombre_oficial_actual = null;
      if (dataToSend.estado_equipo === 'ASIGNADO') {
        dataToSend.estado_equipo = 'DISPONIBLE';
      }
    }

    // Construct extra details
    let extraInfo = `Adquirido: ${dataToSend.fecha_adquisicion} | Condición: ${dataToSend.condicion} | Ubicación: ${dataToSend.ubicacion}. `;
    
    if (dataToSend.tipo_equipo === 'ARMA') {
      extraInfo += `[Arma: ${dataToSend.tipo_arma}, Calibre: ${dataToSend.calibre}] `;
    } else if (dataToSend.tipo_equipo === 'CHALECO') {
      extraInfo += `[Protección: ${dataToSend.nivel_proteccion}, Vencimiento Kevlar: ${dataToSend.fecha_caducidad || 'N/A'}] `;
    } else if (dataToSend.tipo_equipo === 'RADIO') {
      extraInfo += `[Frecuencia: ${dataToSend.frecuencia}, GPS: ${dataToSend.tiene_gps}] `;
    }

    dataToSend.notas = extraInfo + (dataToSend.notas || '');

    if (this.isEditingEquipment) {
      this.service.updateEquipment(dataToSend.id_equipo, dataToSend).subscribe(() => {
        this.showEquipmentModal = false;
        this.loadEquipment();
        this.loadAssignments();
      });
    } else {
      this.service.createEquipment(dataToSend).subscribe(() => {
        this.showEquipmentModal = false;
        this.loadEquipment();
        this.loadAssignments();
      });
    }
  }

  deleteEquipment(id: string) {
    if(confirm('¿Está seguro de eliminar este equipo táctico?')) {
      this.service.deleteEquipment(id).subscribe(() => this.loadEquipment());
    }
  }

  // --- Ticket CRUD & Searchable Vehicle Dropdown ---
  vehicleDropdownOpen = false;
  vehicleSearchQuery = '';

  openCreateTicketModal() {
    this.isEditingTicket = false;
    this.vehicleDropdownOpen = false;
    this.vehicleSearchQuery = '';
    this.ticketForm = { id_ticket: '', id_vehiculo: '', placa_vehiculo: '', categoria_falla: '', descripcion: '', gravedad: 'LOW' };
    this.loadVehicles();
    this.showTicketModal = true;
  }

  openEditTicketModal(tkt: any) {
    this.isEditingTicket = true;
    this.vehicleDropdownOpen = false;
    this.vehicleSearchQuery = '';
    this.ticketForm = { ...tkt };
    this.loadVehicles();
    this.showTicketModal = true;
  }

  toggleVehicleDropdown() {
    this.vehicleDropdownOpen = !this.vehicleDropdownOpen;
    if (this.vehicleDropdownOpen) {
      this.vehicleSearchQuery = '';
    }
  }

  selectVehicle(v: any) {
    this.ticketForm.id_vehiculo = v.id;
    this.ticketForm.placa_vehiculo = v.placa;
    this.vehicleDropdownOpen = false;
    this.vehicleSearchQuery = '';
  }

  getSelectedVehicle(): any {
    return this.vehicles.find(veh => veh.id === this.ticketForm.id_vehiculo);
  }

  get filteredVehicles(): any[] {
    if (!this.vehicleSearchQuery.trim()) return this.vehicles;
    const q = this.vehicleSearchQuery.toLowerCase();
    return this.vehicles.filter(v => 
      (v.placa || '').toLowerCase().includes(q) || 
      (v.marca_modelo || '').toLowerCase().includes(q) ||
      (v.tipo || '').toLowerCase().includes(q)
    );
  }

  onVehicleChange() {
    const v = this.vehicles.find(veh => veh.id === this.ticketForm.id_vehiculo);
    if(v) this.ticketForm.placa_vehiculo = v.placa;
  }

  submitTicket() {
    const currentUser = localStorage.getItem('officer_name') || 'System';
    if (this.isEditingTicket) {
      this.service.updateTicket(this.ticketForm.id_ticket, this.ticketForm).subscribe({
        next: () => {
          this.showTicketModal = false;
          this.loadTickets();
          this.loadVehicles();
        },
        error: (err) => console.error('Error updating ticket:', err)
      });
    } else {
      const ticketData = { ...this.ticketForm, reportado_por: currentUser };
      this.service.createMaintenanceTicket(ticketData).subscribe({
        next: () => {
          this.showTicketModal = false;
          this.loadTickets();
          this.loadVehicles();
        },
        error: (err) => console.error('Error creating ticket:', err)
      });
    }
  }

  deleteTicket(id: string) {
    if(confirm('¿Está seguro de eliminar este ticket de mantenimiento?')) {
      this.service.deleteTicket(id).subscribe({
        next: () => this.loadTickets(),
        error: (err) => console.error('Error deleting ticket:', err)
      });
    }
  }

  // --- Assignments / Logistics Workflows ---
  openAssignModal(eq: any) {
    this.selectedEquipment = eq;
    this.assignForm = { id_oficial: '', nombre_oficial: '', observaciones: '' };
    this.showAssignModal = true;
  }

  submitAssign() {
    if(!this.assignForm.id_oficial) return;
    const ofc = this.officers.find(o => o.id_oficial == this.assignForm.id_oficial);
    if(ofc) this.assignForm.nombre_oficial = `${ofc.nombres} ${ofc.apellidos}`;
    
    this.service.assignEquipment(this.selectedEquipment.id_equipo, this.assignForm).subscribe(() => {
      this.showAssignModal = false;
      this.loadEquipment();
      this.loadAssignments();
    });
  }

  openReturnModal(eq: any) {
    this.selectedEquipment = eq;
    this.returnForm = { observaciones: '', estado_equipo: 'AVAILABLE' };
    this.showReturnModal = true;
  }

  submitReturn() {
    this.service.returnEquipment(this.selectedEquipment.id_equipo, this.returnForm).subscribe(() => {
      this.showReturnModal = false;
      this.loadEquipment();
      this.loadAssignments();
    });
  }

  openResolveModal(tkt: any) {
    this.selectedTicket = tkt;
    this.resolveForm = { observaciones: '' };
    this.showResolveModal = true;
  }

  submitResolve() {
    const currentUser = localStorage.getItem('officer_name') || 'System';
    this.service.resolveTicket(this.selectedTicket.id_ticket, { estado_ticket: 'RESUELTO', resuelto_por: currentUser }).subscribe(() => {
      this.showResolveModal = false;
      this.loadTickets();
      this.loadVehicles();
    });
  }
}
