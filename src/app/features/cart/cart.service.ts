import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { TicketsSocketService } from '../../core/services/tickets-socket.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, Subscription, withLatestFrom } from 'rxjs';

export interface CartItem {
  eventId: number;
  eventName: string;
  quantity: number;
  pricePerTicket: number;
  availableTickets: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnDestroy {
  #subscription = new Subscription();
  #storageKey = 'cartItems';
  #itemsSignal = signal<CartItem[]>([]);
  items = this.#itemsSignal.asReadonly();
  totalQuantity = computed(() => this.#itemsSignal().reduce((total, item) => total + item.quantity, 0));
  ticketsSocketService = inject(TicketsSocketService);
  updatedTicketAvailability = this.ticketsSocketService.updatedTicketAvailability;

  constructor() {
    this.loadCart();
    this.setupTicketUpdateSubscription();
  }

  updateAvailableTickets(eventId: number, availableTickets: number) {
    const updatedItems = this.#itemsSignal().map(item =>
      item.eventId === eventId ? { ...item, availableTickets } : item
    );
    this.#itemsSignal.set(updatedItems);
  }

  addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    const current = this.#itemsSignal();
    const existing = current.find(cartItem => cartItem.eventId === item.eventId);

    if (existing) {
      this.updateQuantity(item.eventId, existing.quantity + quantity);
    } else {
      this.#itemsSignal.set([...current, { ...item, quantity }]);
      this.saveCart();
    }
  }

  updateQuantity(eventId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(eventId);
      return;
    }

    const updated = this.#itemsSignal().map(item => (item.eventId === eventId ? { ...item, quantity } : item));
    this.#itemsSignal.set(updated);
    this.saveCart();
  }

  removeFromCart(eventId: number) {
    const filtered = this.#itemsSignal().filter(item => item.eventId !== eventId);
    this.#itemsSignal.set(filtered);
    this.saveCart();
  }

  clearCart() {
    this.#itemsSignal.set([]);
    this.saveCart();
  }

  private saveCart() {
    console.log('saving to cart');
    const items = this.#itemsSignal();
    console.log(items);
    localStorage.setItem(this.#storageKey, JSON.stringify(items));
  }

  private loadCart() {
    const cartData = localStorage.getItem(this.#storageKey);
    if (cartData) {
      try {
        const parsedData: CartItem[] = JSON.parse(cartData);
        if (Array.isArray(parsedData)) {
          this.#itemsSignal.set(parsedData);
        } else {
          console.error('Invalid cart data in localStorage');
        }
      } catch (error) {
        console.error('Failed to parse cart data from localStorage', error);
      }
    }
  }

  private setupTicketUpdateSubscription() {
    const ticketUpdate$ = toObservable(this.ticketsSocketService.updatedTicketAvailability).pipe(
      filter((update): update is { eventId: number; availableTickets: number } => !!update),
      withLatestFrom(toObservable(this.items))
    );

    const ticketSub = ticketUpdate$.subscribe(([ticketUpdate, cartItems]) => {
      const { eventId, availableTickets } = ticketUpdate;
      const updatedItems = cartItems.map(item => {
        if (item.eventId === eventId) {
          return { ...item, availableTickets };
        }
        return item;
      });

      this.#subscription.add(ticketSub);
      this.#itemsSignal.set(updatedItems);
      localStorage.setItem(this.#storageKey, JSON.stringify(updatedItems));
    });
  }

  ngOnDestroy(): void {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }
  }
}
