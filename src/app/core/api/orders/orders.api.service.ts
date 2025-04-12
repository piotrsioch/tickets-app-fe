import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { User } from '../users/types';
import { withAuthHeaders } from '../../../shared/functions';
import { environment } from '../../../../environments';
import { firstValueFrom } from 'rxjs';
import { CreateOrder, CreateOrderResponse } from './types';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  async getOrderById(id: string): Promise<User> {
    const headers = withAuthHeaders(this.authService);
    const user$ = this.http.get<User>(`${environment.apiRoot}/orders/${id}`, { ...headers });

    return await firstValueFrom(user$);
  }

  async createOrder(data: CreateOrder): Promise<CreateOrderResponse> {
    const $order = this.http.post<CreateOrderResponse>(`${environment.apiRoot}/orders`, data);

    return await firstValueFrom($order);
  }
}
