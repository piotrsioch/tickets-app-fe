import { Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { EventsApiService } from '../../core/api/events';
import { PaginationOptions } from '../../shared/models';
import { EventModel } from '../../core/api/events';
import { MatColumnDef } from '@angular/material/table';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, Subscription, withLatestFrom } from 'rxjs';
import { EventCardComponent } from './event-card/event-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TicketsSocketService } from '../../core/services/tickets-socket.service';
import { CategoriesApiService, Category } from '../../core/api/categories';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'tickets-events',
  imports: [MatColumnDef, MatFormField, MatInput, MatLabel, EventCardComponent, MatPaginator, MatCheckbox],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnDestroy {
  private subscriptions = new Subscription();

  eventsApiService = inject(EventsApiService);
  ticketSocketService = inject(TicketsSocketService);
  categoriesApiService = inject(CategoriesApiService);

  updatedTicketAvailability = this.ticketSocketService.updatedTicketAvailability;
  #eventsSignal = signal<EventModel[] | null>(null);

  mainCategories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);
  onlyAvailable = signal<boolean>(false);

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
    this.loadMainCategories();
    this.setupSearchSubscription();
    this.setupPaginationEffect();
    this.setupTicketUpdateSubscription();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  pageChangeEvent(event: PageEvent) {
    const { pageIndex: page, pageSize: limit } = event;
    const { page: _p, limit: _l, ...rest } = this.paginationOptions();
    this.paginationOptions.set({ page, limit, ...rest });
  }

  onCategorySelected(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const categoryId = selectedValue ? +selectedValue : null;
    this.selectedCategoryId.set(categoryId);

    this.updatePaginationWhere();
  }

  onAvailableOnlyChanged(value: boolean) {
    this.onlyAvailable.set(value);

    this.updatePaginationWhere();
  }

  private updatePaginationWhere() {
    const categoryId = this.selectedCategoryId();
    const onlyAvailable = this.onlyAvailable();

    const where: Record<string, unknown> = {};
    if (categoryId !== null) {
      where['mainCategory'] = { id: categoryId };
    }
    if (onlyAvailable) {
      where['availableTickets'] = { $gt: 0 };
    }

    const current = this.paginationOptions();
    this.paginationOptions.set({ ...current, where });
  }

  private async loadMainCategories() {
    const mainCategories = await this.categoriesApiService.getMainCategories({ limit: 0, page: 0 });
    mainCategories.items.sort((a, b) => a.name.localeCompare(b.name));
    this.mainCategories.set(mainCategories.items);
  }

  private async loadEvents() {
    const pagination = this.paginationOptions();
    const data = await this.eventsApiService.getAllEvents(pagination);
    const { items: events, total } = data;
    this.#eventsSignal.set(events);
    this.totalEvents.set(total);
  }

  private setupSearchSubscription() {
    const search$ = toObservable(this.searchValue);
    const searchSub = search$.pipe(debounceTime(400)).subscribe(search => {
      const { search: _, ...rest } = this.paginationOptions();
      this.paginationOptions.set({ search, ...rest });
    });
    this.subscriptions.add(searchSub);
  }

  private setupPaginationEffect() {
    effect(() => {
      const paginationOptions = this.paginationOptions();
      if (paginationOptions) {
        this.loadEvents();
      }
    });
  }

  private setupTicketUpdateSubscription() {
    const ticketUpdate$ = toObservable(this.updatedTicketAvailability).pipe(
      filter((update): update is { eventId: number; availableTickets: number } => !!update),
      withLatestFrom(toObservable(this.events))
    );

    const ticketSub = ticketUpdate$.subscribe(([ticketUpdate, events]) => {
      const eventId = ticketUpdate.eventId;
      const updatedEvent = events?.find(e => e.id === eventId);
      if (events && updatedEvent) {
        const newEvent = {
          ...updatedEvent,
          availableTickets: ticketUpdate.availableTickets,
        };
        const filteredEvents = events.filter(e => e.id !== eventId);
        const updatedEvents = [...filteredEvents, newEvent].sort((a, b) => a.id - b.id);
        this.#eventsSignal.set(updatedEvents);
      }
    });

    this.subscriptions.add(ticketSub);
  }
}
