import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthApiService, User, RegisterUser } from '../api/auth';

const TOKEN_STORAGE_KEY = 'accessToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #userTokenSignal = signal<string | null>(null);
  userToken = this.#userTokenSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userToken);

  authApiService = inject(AuthApiService);

  constructor() {
    this.readTokenFromLocalStorage();

    effect(() => {
      const token = this.userToken();
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
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
    const user = await this.authApiService.register(data);
    return user;
  }
}
