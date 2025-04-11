import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tickets-event-details',
  imports: [],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  event = signal<Event | null>(null);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.event.set(this.route.snapshot.data['event']);
    console.log(this.event());
  }
}
