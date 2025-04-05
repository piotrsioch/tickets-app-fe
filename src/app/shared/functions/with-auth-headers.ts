import { inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';

export function withAuthHeaders() {
  const authService = inject(AuthService);
  const token = authService.userToken();

  return token
    ? {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    : {};
}
