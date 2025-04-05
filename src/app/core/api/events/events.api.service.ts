import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments';
import { PaginationOptions, PaginationOutput } from '../../../shared/models';
import { buildPaginationParams, withAuthHeaders } from '../../../shared/functions';
import { firstValueFrom } from 'rxjs';
import { Event, CreateEvent } from './types';

@Injectable({
  providedIn: 'root',
})
export class EventsApiService {
  http = inject(HttpClient);

  async createEvent(data: CreateEvent): Promise<Event> {
    const headers = withAuthHeaders();
    const event$ = this.http.post<Event>(`${environment.apiRoot}/events`, data, { ...headers });

    return await firstValueFrom(event$);
  }

  async getAllEvents(options: PaginationOptions): Promise<PaginationOutput<Event>> {
    const params = buildPaginationParams(options);
    const events$ = this.http.get<PaginationOutput<Event>>(`${environment.apiRoot}/events`, { params });

    return await firstValueFrom(events$);
  }

  async getEventById(id: number): Promise<Event> {
    const event$ = this.http.get<Event>(`${environment.apiRoot}/events/${id}`);

    return await firstValueFrom(event$);
  }

  async updateEvent(id: number, data: Partial<Event>): Promise<Event> {
    const headers = withAuthHeaders();
    const event$ = this.http.put<Event>(`${environment.apiRoot}/events/${id}`, data, { ...headers });

    return await firstValueFrom(event$);
  }

  async deleteEvent(id: number): Promise<void> {
    const headers = withAuthHeaders();
    const event$ = this.http.delete<void>(`${environment.apiRoot}/events/${id}`, { ...headers });

    return await firstValueFrom(event$);
  }
}
