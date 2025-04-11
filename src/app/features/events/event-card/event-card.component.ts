import { Component, input } from '@angular/core';
import { Event as EventModel } from '../../../core/api/events';

@Component({
  selector: 'tickets-event-card',
  imports: [],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  event = input.required<EventModel>();
}
