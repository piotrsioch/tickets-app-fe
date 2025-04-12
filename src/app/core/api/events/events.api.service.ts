import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments';
import { PaginationOptions, PaginationOutput } from '../../../shared/models';
import { buildPaginationParams, withAuthHeaders } from '../../../shared/functions';
import { firstValueFrom } from 'rxjs';
import { EventModel, CreateEvent } from './types';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventsApiService {
  http = inject(HttpClient);
  authService = inject(AuthService);

  async createEvent(data: CreateEvent): Promise<EventModel> {
    const headers = withAuthHeaders(this.authService);
    const event$ = this.http.post<EventModel>(`${environment.apiRoot}/events`, data, { ...headers });

    return await firstValueFrom(event$);
  }

  async getAllEvents(options: PaginationOptions): Promise<PaginationOutput<EventModel>> {
    const params = buildPaginationParams(options);
    const events$ = this.http.get<PaginationOutput<EventModel>>(`${environment.apiRoot}/events`, { params });

    return await firstValueFrom(events$);
  }

  async getEventById(id: number): Promise<EventModel> {
    const event$ = this.http.get<EventModel>(`${environment.apiRoot}/events/${id}`);

    return await firstValueFrom(event$);
  }

  async updateEvent(id: number, data: Partial<EventModel>): Promise<EventModel> {
    const headers = withAuthHeaders(this.authService);
    const event$ = this.http.put<EventModel>(`${environment.apiRoot}/events/${id}`, data, { ...headers });

    return await firstValueFrom(event$);
  }

  async deleteEvent(id: number): Promise<void> {
    const headers = withAuthHeaders(this.authService);
    const event$ = this.http.delete<void>(`${environment.apiRoot}/events/${id}`, { ...headers });

    return await firstValueFrom(event$);
  }
}
