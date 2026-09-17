import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SidebarComponent],
  templateUrl: './settings.html',
})
export class AdminSettingsComponent implements OnInit {
  showProfileDropdown = false;
  // Form Values
  settings = {
    sessionTimeout: 30,
    minPasswordLength: 8,
    maxFailedAttempts: 3,
    threatAlarmThreshold: 10,
    enableAutoDispatch: true,
    apiEncryption: true,
    alertsNotificationType: 'sms_email'
  };

  isSaving: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  saveSettings() {
    this.isSaving = true;
    this.showSuccessMessage = false;

    // Simulate saving process
    setTimeout(() => {
      this.isSaving = false;
      this.showSuccessMessage = true;

      // Hide success message after 4 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 4000);
    }, 1500);
  }
}
