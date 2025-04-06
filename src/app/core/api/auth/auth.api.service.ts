import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments';
import { RegisterUser, User } from './types';
import { catchError, firstValueFrom, of } from 'rxjs';

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

  async logout(token: string): Promise<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const logout$ = this.http.post(`${environment.apiRoot}/auth/logout`, null, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return of(null);
        }
        throw error;
      })
    );

    await firstValueFrom(logout$);
  }
}
