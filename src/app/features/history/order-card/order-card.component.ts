import { Component, effect, inject, input, signal } from '@angular/core';
import { Order, OrdersApiService } from '../../../core/api/orders';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EventsApiService } from '../../../core/api/events';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { ToastSeverity } from '../../../core/services/types/toast.model';

export interface OrderEventTicket {
  eventId: number;
  id: string;
  eventName: string;
  isUsed: boolean;
}

@Component({
  selector: 'tickets-order-card',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
})
export class OrderCardComponent {
  order = input.required<Order>();
  payAvailable = signal<boolean>(false);
  tickets = signal<OrderEventTicket[] | null>(null);
  eventsApiService = inject(EventsApiService);
  ordersApiService = inject(OrdersApiService);
  toastService = inject(ToastService);
  router = inject(Router);

  constructor() {
    effect(() => {
      const currentOrder = this.order();
      if (currentOrder) {
        this.fetchEventData();
      }
    });
  }

  getTicketQuantitiesForPaidOrder(order: Order): Record<number, number> {
    const ticketQuantities: Record<number, number> = {};
    for (const ticket of order.tickets) {
      ticketQuantities[ticket.eventId] = (ticketQuantities[ticket.eventId] || 0) + 1;
    }
    return ticketQuantities;
  }

  async getTicketQuantitiesForUnpaidOrder(order: Order): Promise<Record<number, number>> {
    const orderTickets = await this.ordersApiService.getOrderTicketsById(order.id);
    const ticketQuantities: Record<number, number> = {};
    for (const ticket of orderTickets) {
      ticketQuantities[ticket.eventId] = (ticketQuantities[ticket.eventId] || 0) + 1;
    }
    return ticketQuantities;
  }

  async checkAvailability(ticketQuantities: Record<number, number>): Promise<boolean[]> {
    return await Promise.all(
      Object.entries(ticketQuantities).map(async ([eventIdStr, quantity]) => {
        const eventId = Number(eventIdStr);
        const event = await this.eventsApiService.getEventById(eventId);
        return event.availableTickets >= quantity;
      })
    );
  }

  async onPayClicked() {
    const ticketQuantities = await this.getTicketQuantitiesForUnpaidOrder(this.order());

    const availabilityChecks = await this.checkAvailability(ticketQuantities);
    const allAvailable = availabilityChecks.every(Boolean);

    if (allAvailable) {
      const order = this.order();
      this.router.navigate(['/payment'], {
        queryParams: {
          clientSecret: order.clientSecret,
          orderId: order.id,
        },
      });
    } else {
      this.payAvailable.set(false);
      this.toastService.show('Some of your tickets are no longer available.', ToastSeverity.WARNING);
    }
  }

  async fetchEventData() {
    const order = this.order();
    const hasGeneratedTickets = order.tickets.length > 0;

    let ticketQuantities: Record<number, number>;

    if (hasGeneratedTickets) {
      ticketQuantities = this.getTicketQuantitiesForPaidOrder(order);
    } else {
      ticketQuantities = await this.getTicketQuantitiesForUnpaidOrder(order);
    }

    const availabilityChecks = await this.checkAvailability(ticketQuantities);
    const allAvailable = availabilityChecks.every(Boolean);
    this.payAvailable.set(allAvailable);

    if (hasGeneratedTickets) {
      const ticketData = await Promise.all(
        order.tickets.map(async ticket => {
          const event = await this.eventsApiService.getEventById(ticket.eventId);
          return {
            eventId: event.id,
            eventName: event.name,
            id: ticket.id,
            isUsed: ticket.isUsed,
          };
        })
      );
      this.tickets.set(ticketData);
    } else {
      this.tickets.set(null);
    }
  }
}
