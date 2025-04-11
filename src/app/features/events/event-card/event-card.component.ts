import { Component, inject, input } from '@angular/core';
import { Event as EventModel } from '../../../core/api/events';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'tickets-event-card',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  event = input.required<EventModel>();
  router = inject(Router);

  async navigateToDetails() {
    const { id } = this.event();
    await this.router.navigateByUrl(`events/${id}`);
  }
}
