import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventModel } from '../../../core/api/events';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TicketsSocketService } from '../../../core/services/tickets-socket.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Subscription } from 'rxjs';
import { ModalService, ModalStyle } from '../../../shared/services/modal.service';
import { AddToCardModalComponent } from '../add-to-card-modal/add-to-card-modal.component';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'tickets-event-details',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnDestroy {
  #subscription = new Subscription();
  modal = inject(ModalService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cartService = inject(CartService);
  ticketSocketService = inject(TicketsSocketService);
  event = signal<EventModel | null>(null);
  updatedTicketAvailability = this.ticketSocketService.updatedTicketAvailability;

  constructor() {
    this.event.set(this.route.snapshot.data['event']);
    this.setupTicketUpdateSubscription();
  }

  ngOnDestroy() {
    this.#subscription.unsubscribe();
  }

  async onBuyClicked() {
    const event = this.event();

    if (!event) {
      return;
    }

    const { id: eventId, name: eventName, availableTickets, pricePerTicket } = event;

    this.cartService.addToCart({ eventId, eventName, availableTickets, pricePerTicket }, 1);

    const wasGoToCartClicked: boolean | undefined = await this.modal.open(AddToCardModalComponent, {
      style: ModalStyle.ConfirmModal,
    });

    if (wasGoToCartClicked) {
      await this.router.navigate(['cart']);
    }
  }

  private setupTicketUpdateSubscription() {
    const ticketUpdate$ = toObservable(this.updatedTicketAvailability).pipe(
      filter((update): update is { eventId: number; availableTickets: number } => !!update)
    );

    const ticketSub = ticketUpdate$.subscribe(data => {
      const { eventId, availableTickets } = data;
      const event = this.event();

      if (event && eventId === event.id) {
        const { availableTickets: _, ...rest } = event;
        this.event.set({ availableTickets, ...rest });
      }
    });

    this.#subscription.add(ticketSub);
  }
}
