import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments';
import { firstValueFrom } from 'rxjs';
import { User } from './auth.api.types';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  http = inject(HttpClient);
  async login(email: string, password: string) {
    const login$ = this.http.post<User>(`${environment.apiRoot}/auth/login`, { email, password });

    const data = await firstValueFrom(login$);

    console.log(data);

    return data;
  }
}
