import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';
import { AuthService } from '../services/auth.service';
import { CategoryService, SystemCategory } from '../services/category.service';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './categories.html',
})
export class AdminCategoriesComponent implements OnInit {
  showProfileDropdown = false;
  profile: string | null = null;

  categories: SystemCategory[] = [];
  filteredCategories: SystemCategory[] = [];
  searchQuery: string = '';

  // Tab State
  selectedCatalogType: string = 'primary_type';
  catalogTypesList = [
    { type: 'primary_type', label: 'Categorías de Delitos', icon: 'gavel', desc: 'Clasificaciones principales para delitos e informes de incidentes.' },
    { type: 'location_type', label: 'Tipos de Ubicación', icon: 'home_work', desc: 'Lugares estandarizados donde ocurren los crímenes o eventos policiales.' },
    { type: 'district', label: 'Distritos y Cuadrantes', icon: 'domain', desc: 'Distritos y divisiones policiales geográficas oficiales.' },
    { type: 'traffic_law', label: 'Infracciones de Tránsito', icon: 'traffic', desc: 'Catálogo de leyes de tránsito, códigos de infracción y multas.' },
    { type: 'vehicle_type', label: 'Tipos de Flota Vehicular', icon: 'local_shipping', desc: 'Clasificaciones de patrullas y vehículos en operaciones activas.' }
  ];

  // Modal Control
  showModal: boolean = false;
  isEditing: boolean = false;
  modalError: string = '';
  isSaving: boolean = false;

  currentCategory: Partial<SystemCategory> = {
    tipo_catalogo: 'primary_type',
    valor: '',
    descripcion: '',
    activo: true
  };

  constructor(
    public authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories(this.selectedCatalogType).subscribe({
      next: (data) => {
        this.categories = data;
        this.applyFilters();
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  selectCatalog(type: string) {
    this.selectedCatalogType = type;
    this.searchQuery = '';
    this.loadCategories();
  }

  applyFilters() {
    if (!this.searchQuery.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const q = this.searchQuery.toLowerCase();
      this.filteredCategories = this.categories.filter(c =>
        c.valor.toLowerCase().includes(q) ||
        c.descripcion.toLowerCase().includes(q)
      );
    }
  }

  openCreateModal() {
    this.isEditing = false;
    this.modalError = '';
    this.currentCategory = {
      tipo_catalogo: this.selectedCatalogType,
      valor: '',
      descripcion: '',
      activo: true
    };
    this.showModal = true;
  }

  openEditModal(category: SystemCategory) {
    this.isEditing = true;
    this.modalError = '';
    this.currentCategory = { ...category };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCategory() {
    if (!this.currentCategory.valor?.trim()) {
      this.modalError = 'El valor es obligatorio.';
      return;
    }

    this.isSaving = true;
    this.modalError = '';

    // Enforce upper case for districts and crime types to follow database standards
    if (this.selectedCatalogType === 'primary_type' || this.selectedCatalogType === 'district' || this.selectedCatalogType === 'traffic_law') {
      this.currentCategory.valor = this.currentCategory.valor.toUpperCase().trim();
    }

    if (this.isEditing && this.currentCategory.id_catalogo) {
      this.categoryService.updateCategory(this.currentCategory.id_catalogo, this.currentCategory).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving = false;
          this.modalError = err.error?.error || 'Error al actualizar la opción.';
        }
      });
    } else {
      this.categoryService.createCategory(this.currentCategory).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving = false;
          this.modalError = err.error?.error || 'Error al crear la opción.';
        }
      });
    }
  }

  toggleActive(category: SystemCategory) {
    const updated = { ...category, activo: !category.activo };
    this.categoryService.updateCategory(category.id_catalogo, updated).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }

  getCatalogLabel(type: string): string {
    return this.catalogTypesList.find(c => c.type === type)?.label || type;
  }
}
