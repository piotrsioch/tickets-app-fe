import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { ConfirmModalComponent } from '../../shared/components/modal/confirm-modal/confirm-modal.component';
import { ModalService, ModalStyle } from '../../shared/services/modal.service';
import { CustomDatasource, PageChangeEvent, TableColumn } from '../../shared/components/table/table.assets';
import { TableComponent } from '../../shared/components/table/table.component';
import { EventsApiService } from '../../core/api/events';
import { PaginationData } from '../categories/categories.component';
import { Event } from '../../core/api/events';
import { PaginationOptions } from '../../shared/models';
import { AdminEventsModalComponent } from './admin-events-modal/admin-events-modal.component';

@Component({
  selector: 'tickets-admin-events',
  imports: [TableComponent],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.scss',
})
export class AdminEventsComponent implements OnInit {
  @ViewChild(TableComponent) tableComponent!: TableComponent<Event>;
  modal = inject(ModalService);
  eventsApiService = inject(EventsApiService);
  eventsColumns = signal<TableColumn[]>([
    {
      name: 'Id',
      dataKey: 'id',
    },
    {
      name: 'Name',
      dataKey: 'name',
    },
    {
      name: 'Event Date',
      dataKey: 'eventDate',
      type: 'date',
    },
    {
      name: 'Venue',
      dataKey: 'venue',
    },
    {
      name: 'Available Tickets',
      dataKey: 'availableTickets',
    },
  ]);
  events = signal<CustomDatasource<Event> | null>(null);
  search = signal<string>('');
  currentPaginationData = signal<PaginationData>({ page: 0, limit: 10 });

  ngOnInit(): void {
    this.loadEvents();
  }

  async onSearchChanged(search: string): Promise<void> {
    this.search.set(search);
    await this.loadEvents({ search, page: 0, limit: 10 });
  }

  async onPageChanged(data: PageChangeEvent) {
    const search = this.search();
    const { pageIndex: page, pageSize: limit } = data;

    this.currentPaginationData.set({ page, limit });

    await this.loadEvents({ page, limit, search });
  }

  async onEditClicked(event: Event): Promise<void> {
    const updatedEvent = await this.modal.open(AdminEventsModalComponent, {
      data: { event, mode: 'edit' },
    });

    if (!updatedEvent) {
      return;
    }

    const events = this.events();
    const newEvents = events!.data.map(ev => (ev.id === updatedEvent.id ? updatedEvent : ev));

    this.events.set({ data: newEvents, total: events!.total });
  }

  async onDeleteClicked(event: Event) {
    const wasDeleted = await this.modal.open(ConfirmModalComponent, { style: ModalStyle.ConfirmModal });

    if (!wasDeleted) {
      return;
    }

    await this.eventsApiService.deleteEvent(event.id);

    if (this.events()!.data.length === 1 && this.tableComponent.paginator) {
      this.tableComponent.paginator.previousPage();
      return;
    }

    const events = this.events();
    const newEvents = events!.data.filter(ev => ev.id !== event.id);
    const newTotal = events!.total - 1;

    this.events.set({ data: newEvents, total: newTotal });
  }

  async onAddClicked() {
    const newEvent = await this.modal.open(AdminEventsModalComponent, { data: { mode: 'create' } });

    if (newEvent) {
      const events = this.events();
      const currentPaginationData = this.currentPaginationData();
      const newTotal = events!.total + 1;

      if (events!.data.length < currentPaginationData.limit) {
        const newEvents = [...events!.data, newEvent];
        this.events.set({ data: newEvents, total: newTotal });
      } else {
        this.events.set({ data: events!.data, total: newTotal });
      }
    }
  }

  private async loadEvents(options?: PaginationOptions): Promise<void> {
    const optionsWithSearch: PaginationOptions = options
      ? { ...options, searchFields: ['name', 'venue'] }
      : { page: 0, limit: 10 };

    const events = await this.eventsApiService.getAllEvents(optionsWithSearch);
    const mappedEvents: CustomDatasource<Event> = {
      data: events.items,
      total: events.total,
    };

    this.events.set(mappedEvents);
  }
}
