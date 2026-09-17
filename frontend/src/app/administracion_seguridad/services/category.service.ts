import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SystemCategory {
  id_catalogo: number;
  tipo_catalogo: string;
  valor: string;
  descripcion: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8000/api/auth/categories/';

  constructor(private http: HttpClient) {}

  getCategories(tipo?: string, activeOnly?: boolean): Observable<SystemCategory[]> {
    let params = new HttpParams();
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    if (activeOnly) {
      params = params.set('activo', '1');
    }
    return this.http.get<SystemCategory[]>(this.apiUrl, { params });
  }

  createCategory(category: Partial<SystemCategory>): Observable<SystemCategory> {
    return this.http.post<SystemCategory>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Partial<SystemCategory>): Observable<SystemCategory> {
    return this.http.put<SystemCategory>(`${this.apiUrl}${id}/`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
