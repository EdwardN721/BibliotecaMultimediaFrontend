import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '@core/services/auth/auth';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme/theme.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, RouterLinkActive, ConfirmDialogModule, ToastModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {
  public authService: AuthService = inject(AuthService);
  public router: Router = inject(Router);
  public themeService: ThemeService = inject(ThemeService);

  isMobileMenuOpen: WritableSignal<boolean> = signal<boolean>(false);
  isCatalogosOpen: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    // El panel de administración usa tema oscuro profesional
    this.themeService.setDarkMode(true);
  }

  currentRoleLabel(): string {
    if (this.authService.isAdmin()) return 'Administrador';
    if (this.authService.isRegularUser()) return 'Usuario Estándar';
    return 'Invitado';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((val) => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  toggleCatalogos() {
    this.isCatalogosOpen.update((val) => !val);
  }
}
