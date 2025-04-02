import { inject, Injectable } from '@angular/core';
import { AuthApiService } from '../api/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authApiService = inject(AuthApiService);

  async login(email: string, password: string) {
    return await this.authApiService.login(email, password);
  }
}
