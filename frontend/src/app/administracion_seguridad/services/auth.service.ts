import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth/login/';
  private currentRoleSubject = new BehaviorSubject<string | null>(localStorage.getItem('role'));

  currentRole$ = this.currentRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          if (response.user) {
            localStorage.setItem('id_oficial', response.user.id_oficial.toString());
            localStorage.setItem('officer_name', `Ofc. ${response.user.nombres} ${response.user.apellidos}`);
            localStorage.setItem('url_fotografia', response.user.url_fotografia || '');
          }
          this.currentRoleSubject.next(response.role);
        }
      })
    );
  }

  logout() {
    this.http.post('http://localhost:8000/api/auth/logout/', {}).subscribe({
      next: () => this.forceLocalLogout(),
      error: () => this.forceLocalLogout()
    });
  }

  forceLocalLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id_oficial');
    localStorage.removeItem('officer_name');
    localStorage.removeItem('url_fotografia');
    this.currentRoleSubject.next(null);
  }

  getRole(): string | null {
    return this.currentRoleSubject.value;
  }

  getOfficerId(): number {
    const id = localStorage.getItem('id_oficial');
    return id ? parseInt(id, 10) : 1;
  }

  getOfficerName(): string {
    return localStorage.getItem('officer_name') || 'Oficial Custodio';
  }

  getProfileImage(): string {
    const url = localStorage.getItem('url_fotografia');
    if (url && url.trim() !== '' && !url.includes('assets/avatars/')) {
      return url;
    }
    return this.getFallbackProfileImage();
  }

  getFallbackProfileImage(): string {
    const name = this.getOfficerName();
    const cleanName = name.replace('Ofc. ', '').trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=0b0f19&color=ffffff&size=128&bold=true`;
  }

  updateProfileImage(url: string) {
    localStorage.setItem('url_fotografia', url);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- CYBERSECURITY BACKUP METHODS ---
  getBackups() {
    return this.http.get<any[]>('http://localhost:8000/api/auth/backups/');
  }

  createBackup(type: string = 'completo') {
    return this.http.post<any>('http://localhost:8000/api/auth/backups/', { type });
  }

  downloadBackup(backupName: string) {
    return this.http.get(`http://localhost:8000/api/auth/backups/${backupName}/download/`, {
      responseType: 'blob'
    });
  }

  restoreBackup(backupName: string) {
    return this.http.post<any>(`http://localhost:8000/api/auth/backups/${backupName}/restore/`, {});
  }

  // --- CYBERSECURITY PASSWORD RESET METHODS ---
  requestPasswordReset(email: string) {
    return this.http.post<any>('http://localhost:8000/api/auth/password-reset/request/', { email });
  }

  confirmPasswordReset(data: any) {
    return this.http.post<any>('http://localhost:8000/api/auth/password-reset/confirm/', data);
  }

  changePassword(password: string) {
    return this.http.post<any>('http://localhost:8000/api/auth/password-change/', { password });
  }
}

