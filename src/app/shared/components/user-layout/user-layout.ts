import { Component, HostListener, inject, signal, WritableSignal } from '@angular/core';
import { AuthService } from '@core/services/auth/auth';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme/theme.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, RouterLinkActive, ConfirmDialogModule, ToastModule],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayoutComponent {
  public authService: AuthService = inject(AuthService);
  public router: Router = inject(Router);
  private themeService: ThemeService = inject(ThemeService);

  isScrolled: WritableSignal<boolean> = signal(false);
  isMobileMenuOpen: WritableSignal<boolean> = signal(false);

  constructor() {
    // La experiencia tipo streaming siempre es oscura
    this.themeService.setDarkMode(true);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 40);
  }

  get inicialAvatar(): string {
    const nombre = this.authService.nombreUsuario();
    return nombre ? nombre.charAt(0).toUpperCase() : 'U';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
