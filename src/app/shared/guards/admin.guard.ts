import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../core/services/types/decoded-token.model';

export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.userToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }


  const decoded: DecodedToken = jwtDecode(token);
  if (decoded?.['role'] === 'admin') {
    return true;
  }

  router.navigate(['/unauthorized'], { state: { unauthorized: true } });
  return false;
};
