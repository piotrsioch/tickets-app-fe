import { Component, inject, signal, OnInit } from '@angular/core';
import { Order, OrdersApiService } from '../../core/api/orders';
import { OrderCardComponent } from './order-card/order-card.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { ToastSeverity } from '../../core/services/types/toast.model';

@Component({
  selector: 'tickets-history',
  imports: [OrderCardComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  orders = signal<Order[]>([]);
  ordersApiService = inject(OrdersApiService);
  toastService = inject(ToastService);

  ngOnInit() {
    this.fetchUserOrders();
  }

  private async fetchUserOrders() {
    try {
      const orders = await this.ordersApiService.getUserOrders();
      this.orders.set(orders);
    } catch (err: unknown) {
      const error = err as HttpErrorResponse;
      if (error.status === 404) {
        return;
      }
      if (!(error.status === 404)) {
        this.toastService.show('Error during fetching data', ToastSeverity.ERROR);
      }
    }
  }
}
