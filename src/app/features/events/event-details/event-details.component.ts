import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventModel } from '../../../core/api/events';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'tickets-event-details',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  event = signal<EventModel | null>(null);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.event.set(this.route.snapshot.data['event']);
    console.log(this.event());
  }
}
