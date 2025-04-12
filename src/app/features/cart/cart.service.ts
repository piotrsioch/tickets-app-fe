import { computed, Injectable, signal } from '@angular/core';

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
export class CartService {
  #itemsSignal = signal<CartItem[]>([]);
  items = this.#itemsSignal.asReadonly();
  totalQuantity = computed(() => this.#itemsSignal().reduce((total, item) => total + item.quantity, 0));

  addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    const current = this.#itemsSignal();
    const existing = current.find(cartItem => cartItem.eventId === item.eventId);

    if (existing) {
      this.updateQuantity(item.eventId, existing.quantity + quantity);
    } else {
      this.#itemsSignal.set([...current, { ...item, quantity }]);
    }
  }

  updateQuantity(eventId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(eventId);
      return;
    }

    const updated = this.#itemsSignal().map(item => (item.eventId === eventId ? { ...item, quantity } : item));
    this.#itemsSignal.set(updated);
  }

  removeFromCart(eventId: number) {
    const filtered = this.#itemsSignal().filter(item => item.eventId !== eventId);
    this.#itemsSignal.set(filtered);
  }

  clearCart() {
    this.#itemsSignal.set([]);
  }
}
