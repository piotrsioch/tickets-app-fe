import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

export function withAuthHeaders(authService: AuthService) {
  const token = authService.userToken();

  return token
    ? {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    : {};
}
