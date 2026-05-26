import { Component, OnInit } from '@angular/core';
import { AuthService } from '../administracion_seguridad/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent implements OnInit {
  profile: string | null = 'oficial';

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.profile = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
