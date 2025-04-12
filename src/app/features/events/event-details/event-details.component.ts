import { Component, inject, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventModel } from '../../../core/api/events';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TicketsSocketService } from '../../../core/services/tickets-socket.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'tickets-event-details',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnDestroy {
  private subscription = new Subscription();

  route = inject(ActivatedRoute);
  ticketSocketService = inject(TicketsSocketService);
  event = signal<EventModel | null>(null);
  updatedTicketAvailability = this.ticketSocketService.updatedTicketAvailability;

  constructor() {
    this.event.set(this.route.snapshot.data['event']);
    this.setupTicketUpdateSubscription();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

    this.subscription.add(ticketSub);
  }
}
