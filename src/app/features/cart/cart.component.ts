import { Component, computed, inject } from '@angular/core';
import { CartService } from './cart.service';
import { QuantityChangeData } from './cart.types';
import { CartCardComponent } from './cart-card/cart-card.component';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'tickets-cart',
  imports: [CartCardComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  router = inject(Router);
  cartService = inject(CartService);
  cartItems = this.cartService.items;
  totalPrice = computed<number>(() =>
    this.cartItems().reduce((total, item) => total + item.quantity * item.pricePerTicket, 0)
  );

  onQuantityChange(event: QuantityChangeData) {
    const { eventId, quantity } = event;
    this.cartService.updateQuantity(eventId, quantity);
  }

  onRemoveClicked(eventId: number) {
    this.cartService.removeFromCart(eventId);
  }

  onContinueClicked() {
    this.router.navigateByUrl('/cart/checkout');
  }
}
