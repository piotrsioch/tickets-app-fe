import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthApiService, RegisterUser, UserWithToken } from '../api/auth';
import { REFRESH_TOKEN_STORAGE_KEY, TOKEN_STORAGE_KEY } from '../../shared/const';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './types/decoded-token.model';
import { UserRole } from '../api/users/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRefreshToken = signal<string | null>(null);
  #userTokenSignal = signal<string | null>(null);
  #userRoleSignal = signal<UserRole | null>(null);
  userRole = this.#userRoleSignal.asReadonly();
  userToken = this.#userTokenSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userToken());

  authApiService = inject(AuthApiService);

  constructor() {
    this.readTokenFromLocalStorage();

    effect(() => {
      const token = this.userToken();
      const userRefreshToken = this.userRefreshToken();
      if (userRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, JSON.stringify(userRefreshToken));
      }
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));

        const decoded = this.decodeToken(token);

        if (decoded) {
          this.#userRoleSignal.set(decoded.role);
          this.scheduleTokenRefresh(decoded.exp);
        }
      }
    });
  }

  readTokenFromLocalStorage() {
    const jsonToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const jsonRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (jsonToken) {
      const token = JSON.parse(jsonToken);
      this.#userTokenSignal.set(token);
    }

    if (jsonRefreshToken) {
      const token = JSON.parse(jsonRefreshToken);
      this.userRefreshToken.set(token);
    }

    this.#userRoleSignal.set(null);
  }

  async login(email: string, password: string): Promise<UserWithToken> {
    const user = await this.authApiService.login(email, password);

    this.#userTokenSignal.set(user.accessToken);
    this.userRefreshToken.set(user.refreshToken);

    return user;
  }

  async register(data: RegisterUser): Promise<UserWithToken> {
    return await this.authApiService.register(data);
  }

  async logout() {
    const token = this.userToken();
    const refreshToken = this.userRefreshToken();
    this.#userRoleSignal.set(null);
    this.#userTokenSignal.set(null);

    if (token) {
      await this.authApiService.logout(token);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if (refreshToken) {
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
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
    const token = this.userRefreshToken();

    if (token) {
      try {
        const newToken = await this.authApiService.refreshAccessToken(token);

        this.#userTokenSignal.set(newToken);

        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(newToken));
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  }

  private scheduleTokenRefresh(expiryTime: number) {
    const currentTime = Date.now() / 1000;
    const timeToExpiry = expiryTime - currentTime;
    const refreshTime = 60;

    if (timeToExpiry > refreshTime) {
      setTimeout(() => this.refreshToken(), (timeToExpiry - refreshTime) * 1000);
    } else {
      this.refreshToken();
    }
  }
}
