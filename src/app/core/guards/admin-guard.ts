import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()){
    return true;
  }

  return router.parseUrl('/login')
};
