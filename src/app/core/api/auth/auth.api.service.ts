import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments';
import { firstValueFrom } from 'rxjs';
import { User } from './auth.api.types';
import { RegisterUser } from './types/register-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  http = inject(HttpClient);

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<User>(`${environment.apiRoot}/auth/login`, { email, password });

    return await firstValueFrom(login$);
  }

  async register(data: RegisterUser): Promise<User> {
    const register$ = this.http.post<User>(`${environment.apiRoot}/auth/register`, data);

    return await firstValueFrom(register$);
  }
}
