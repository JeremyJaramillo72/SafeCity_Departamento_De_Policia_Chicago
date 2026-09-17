import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../../sidebar/sidebar';
import { AuthService } from '../services/auth.service';

interface SystemUser {
  id_usuario: number;
  id_oficial: number;
  placa_policial: string;
  nombres: string;
  apellidos: string;
  correo: string;
  role: string;
  estado: string;
  ultimo_acceso: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './users.html',
})
export class AdminUsersComponent implements OnInit {
  showProfileDropdown = false;
  users: SystemUser[] = [];

  filteredUsers: SystemUser[] = [];
  searchQuery: string = '';
  roleFilter: string = '';

  // Modal Control
  showModal: boolean = false;
  showSuccessModal = false;
  successModalMessage = '';
  newUserMail = '';
  newUserTempPass = '';
  newUser = {
    nombres: '',
    apellidos: '',
    placa_policial: '',
    correo: '',
    role: 'oficial',
    estado: 'activo'
  };

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<SystemUser[]>('http://localhost:8000/api/auth/users/').subscribe({
      next: (data) => {
        this.users = data.map(user => {
          // Format ultimo_acceso
          if (user.ultimo_acceso === 'Nunca' || user.ultimo_acceso === 'Never') {
            user.ultimo_acceso = 'Nunca';
          } else if (user.ultimo_acceso) {
            const date = new Date(user.ultimo_acceso);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) user.ultimo_acceso = 'Hace un momento';
            else if (diffMins < 60) user.ultimo_acceso = `Hace ${diffMins} minutos`;
            else if (diffHours < 24) user.ultimo_acceso = `Hace ${diffHours} horas`;
            else if (diffDays === 1) user.ultimo_acceso = `Hace 1 día`;
            else user.ultimo_acceso = `Hace ${diffDays} días`;
          }
          return user;
        });
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load users:', err)
    });
  }

  sortField = '';
  sortAscending = true;

  sortUsers(field: string) {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }
    this.applySort();
  }

  applySort() {
    if (!this.sortField) return;
    const field = this.sortField;
    const direction = this.sortAscending ? 1 : -1;
    this.filteredUsers.sort((a, b) => {
      let valA: any = a[field as keyof SystemUser];
      let valB: any = b[field as keyof SystemUser];

      if (field === 'id_usuario' || field === 'id_oficial') {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return -1 * direction;
      if (valA > valB) return 1 * direction;
      return 0;
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(u => {
      const matchesSearch = `${u.nombres} ${u.apellidos} ${u.placa_policial} ${u.correo}`.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesRole = !this.roleFilter || ['ALL', 'TODOS', 'TODAS', 'TODOS LOS ROLES'].includes(this.roleFilter.toUpperCase()) || u.role === this.roleFilter;
      return matchesSearch && matchesRole;
    });
    this.applySort();
  }

  disconnectUser(user: SystemUser) {
    if (confirm(`¿Está seguro de que desea desconectar forzosamente al oficial ${user.nombres} ${user.apellidos}? Su sesión actual será finalizada de inmediato.`)) {
      this.http.post(`http://localhost:8000/api/auth/force-logout/${user.id_usuario}/`, {}).subscribe({
        next: () => {
          user.ultimo_acceso = 'Desconectado';
          user.estado = 'offline';
          alert(`Sesión finalizada. El oficial con placa ${user.placa_policial} ha sido desconectado del sistema.`);
          this.applyFilters();
        },
        error: (err) => {
          console.error(err);
          alert('Hubo un error al intentar desconectar al usuario. Verifique su conexión o permisos.');
        }
      });
    }
  }

  openAddModal() {
    this.newUser = {
      nombres: '',
      apellidos: '',
      placa_policial: '',
      correo: '',
      role: 'oficial',
      estado: 'activo'
    };
    this.showModal = true;
  }

  closeAddModal() {
    this.showModal = false;
  }

  updatePlacaPreview() {
    const initN = this.newUser.nombres ? this.newUser.nombres.trim().charAt(0).toUpperCase() : '';
    const initA = this.newUser.apellidos ? this.newUser.apellidos.trim().charAt(0).toUpperCase() : '';
    
    let prefix = 'OFC-';
    switch (this.newUser.role) {
      case 'administrador_sistema': prefix = 'ADM-'; break;
      case 'administrador': prefix = 'SHF-'; break;
      case 'detective': prefix = 'DET-'; break;
      default: prefix = 'OFC-'; break;
    }
    
    if (initN && initA) {
      this.newUser.placa_policial = `${prefix}${initN}${initA}01`;
    } else {
      this.newUser.placa_policial = '';
    }
  }

  onSubmit() {
    if (this.newUser.nombres && this.newUser.apellidos && this.newUser.placa_policial && this.newUser.correo) {
      this.http.post<any>('http://localhost:8000/api/auth/users/', this.newUser).subscribe({
        next: (res) => {
          const newUserRecord: SystemUser = {
            id_usuario: res.id_usuario,
            id_oficial: res.id_oficial,
            placa_policial: res.placa_policial,
            nombres: res.nombres,
            apellidos: res.apellidos,
            correo: res.correo,
            role: res.role,
            estado: res.estado,
            ultimo_acceso: res.ultimo_acceso
          };
          this.users.push(newUserRecord);
          this.applyFilters();
          this.closeAddModal();
          
          // Open custom success modal
          this.newUserMail = res.correo;
          this.newUserTempPass = res.temp_pass;
          this.successModalMessage = '¡Oficial registrado exitosamente!';
          this.showSuccessModal = true;
        },
        error: (err) => {
          console.error(err);
          alert('Hubo un error al registrar al oficial. Por favor verifique los datos e intente de nuevo.');
        }
      });
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'administrador_sistema': return 'ADMINISTRADOR DE SISTEMA';
      case 'administrador': return 'COMISARIO / JEFE';
      case 'detective': return 'DETECTIVE';
      default: return 'OFICIAL DE PATRULLA';
    }
  }
}
