import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {
  public authService: AuthService = inject(AuthService);
  public router: Router = inject(Router);

  public currentRoleLabel = () => this.authService.isAdmin()
    ? 'Administrador' : 'Usuario';

    logout(){
      this.authService.logout();
      this.router.navigate(['/login']);
    }
}
