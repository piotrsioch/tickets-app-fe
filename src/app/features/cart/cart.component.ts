import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';
import { QuantityChangeData } from './cart.types';
import { CartCardComponent } from './cart-card/cart-card.component';

@Component({
  selector: 'tickets-cart',
  imports: [CartCardComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartService = inject(CartService);
  cartItems = this.cartService.items;

  onQuantityChange(event: QuantityChangeData) {
    const { eventId, quantity } = event;
    this.cartService.updateQuantity(eventId, quantity);
  }

  onRemoveClicked(eventId: number) {
    this.cartService.removeFromCart(eventId);
  }
}
