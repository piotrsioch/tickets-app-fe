import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (_e) {
    return null;
  }
}

export const AdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.userToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const decoded = decodeJWT(token);
  console.log(decoded);
  if (decoded?.['role'] === 'admin') {
    return true;
  }

  router.navigate(['/unauthorized'], { state: { unauthorized: true } });
  return false;
};
