import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { signal } from '@angular/core';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  updatedTicketAvailability = signal<{ eventId: number; availableTickets: number } | null>(null);

  constructor() {
    this.socket = io(`${environment.apiRoot}/ws/events`, {
      path: '/socket.io',
      transports: ['websocket'],
    });

    this.socket.on('ticketAvailability', data => {
      console.log(`Received ticket availability update: ${JSON.stringify(data)}`);
      this.updatedTicketAvailability.set(data);
    });
  }

  subscribeToEvent(eventId: number): void {
    this.socket.emit('subscribeToEvent', eventId);
  }

  broadcastTicketUpdate(eventId: number, availableTickets: number): void {
    this.socket.emit('ticketAvailability', { eventId, availableTickets });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
