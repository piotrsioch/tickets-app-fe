import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthApiService, RegisterUser, User } from '../api/auth';
import { TOKEN_STORAGE_KEY } from '../../shared/const';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './types/decoded-token.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #userTokenSignal = signal<string | null>(null);
  userToken = this.#userTokenSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userToken());

  authApiService = inject(AuthApiService);

  constructor() {
    this.readTokenFromLocalStorage();

    effect(() => {
      const token = this.userToken();
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
        const decoded = this.decodeToken(token);

        if (decoded) {
          this.scheduleTokenRefresh(decoded.exp);
        }
      }
    });
  }

  readTokenFromLocalStorage() {
    const jsonToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (jsonToken) {
      const token = JSON.parse(jsonToken);
      this.#userTokenSignal.set(token);
    }
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.authApiService.login(email, password);

    this.#userTokenSignal.set(user.accessToken);

    return user;
  }

  async register(data: RegisterUser): Promise<User> {
    return await this.authApiService.register(data);
  }

  async logout() {
    const token = this.userToken();

    if (token) {
      await this.authApiService.logout(token);
      this.#userTokenSignal.set(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode(token) as DecodedToken;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  private async refreshToken() {
    const token = this.userToken();

    if (token) {
      try {
        const newToken = await this.authApiService.refreshAccessToken(token);

        this.#userTokenSignal.set(newToken);

        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newToken));

        console.log('Token refreshed:', newToken);
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  }

  private scheduleTokenRefresh(expiryTime: number) {
    console.log('schedule token');
    const currentTime = Date.now() / 1000;
    const timeToExpiry = expiryTime - currentTime;
    const refreshTime = 60;

    console.log('czas przed oswiezeniem ', timeToExpiry);

    if (timeToExpiry > refreshTime) {
      setTimeout(() => this.refreshToken(), (timeToExpiry - refreshTime) * 1000);
    } else {
      this.refreshToken();
    }
  }
}
