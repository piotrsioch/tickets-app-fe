import { Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { EventsApiService } from '../../core/api/events';
import { PaginationOptions } from '../../shared/models';
import { Event as EventModel } from '../../core/api/events';
import { MatColumnDef } from '@angular/material/table';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, Subscription } from 'rxjs';
import { EventCardComponent } from './event-card/event-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'tickets-events',
  imports: [MatColumnDef, MatFormField, MatInput, MatLabel, EventCardComponent, MatPaginator],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnDestroy {
  private searchSubscription: Subscription | undefined;

  eventsApiService = inject(EventsApiService);
  #eventsSignal = signal<EventModel[] | null>(null);
  events = this.#eventsSignal.asReadonly();
  totalEvents = signal<number | null>(null);
  searchValue = signal<string>('');
  paginationSizes = input<number[]>([5, 10, 20]);
  defaultPageSize = input<number>(this.paginationSizes()[0]);
  paginationOptions = signal<PaginationOptions>({
    page: 0,
    limit: this.defaultPageSize(),
    searchFields: ['name', 'venue'],
  });

  constructor() {
    const search$ = toObservable(this.searchValue);
    this.searchSubscription = search$.pipe(debounceTime(400)).subscribe(search => {
      const { search: _, ...rest } = this.paginationOptions();
      this.paginationOptions.set({ search, ...rest });
    });

    effect(() => {
      const paginationOptions = this.paginationOptions();
      if (paginationOptions) {
        this.loadEvents();
      }
    });
  }

  private async loadEvents() {
    const pagination = this.paginationOptions();
    const data = await this.eventsApiService.getAllEvents(pagination);
    const { items: events, total } = data;
    this.#eventsSignal.set(events);
    this.totalEvents.set(total);
    console.log(events);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  pageChangeEvent(event: PageEvent) {
    const { pageIndex: page, pageSize: limit } = event;
    const { page: _p, limit: _l, ...rest } = this.paginationOptions();
    this.paginationOptions.set({ page, limit, ...rest });
  }
}
