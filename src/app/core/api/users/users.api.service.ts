import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { withAuthHeaders } from '../../../shared/functions';
import { environment } from '../../../../environments';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from './types';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  async getUserData(): Promise<User> {
    const headers = withAuthHeaders(this.authService);
    const user$ = this.http.get<User>(`${environment.apiRoot}/users/user`, { ...headers });

    return await firstValueFrom(user$);
  }
}
