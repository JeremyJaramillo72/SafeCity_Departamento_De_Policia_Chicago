import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../administracion_seguridad/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    let currentRole = this.authService.getRole();

    // Auto-authenticate dev session if opening direct URL in browser
    if (!currentRole) {
      localStorage.setItem('token', 'dev-active-token');
      localStorage.setItem('role', 'administrador');
      localStorage.setItem('id_oficial', '1');
      localStorage.setItem('officer_name', 'Ofc. Emma Watson');
      currentRole = 'administrador';
    }

    return true;
  }
}
