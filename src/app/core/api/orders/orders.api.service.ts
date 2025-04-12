import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { withAuthHeaders } from '../../../shared/functions';
import { environment } from '../../../../environments';
import { firstValueFrom } from 'rxjs';
import { CreateOrder, CreateOrderResponse, Order } from './types';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  async getOrderById(id: string): Promise<Order> {
    const headers = withAuthHeaders(this.authService);
    const order$ = this.http.get<Order>(`${environment.apiRoot}/orders/${id}`, { ...headers });

    return await firstValueFrom(order$);
  }

  async createOrder(data: CreateOrder): Promise<CreateOrderResponse> {
    const $order = this.http.post<CreateOrderResponse>(`${environment.apiRoot}/orders`, data);

    return await firstValueFrom($order);
  }
}
