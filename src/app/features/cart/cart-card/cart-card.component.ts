import { Component, input, output, signal, effect, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CartItem } from '../cart.service';
import { QuantityChangeData } from '../cart.types';
import { MatIconButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'tickets-cart-card',
  imports: [CurrencyPipe, MatIconButton, MatIcon],
  templateUrl: './cart-card.component.html',
  styleUrl: './cart-card.component.scss',
})
export class CartCardComponent implements AfterViewInit {
  @ViewChild('select') selectElement: ElementRef<HTMLSelectElement> | undefined;
  item = input<CartItem | undefined>();
  selectableQuantities = signal<number[]>([]);
  quantityChange = output<QuantityChangeData>();
  itemRemove = output<number>();
  totalPrice = signal<number>(0);

  constructor() {
    effect(() => {
      const currentItem = this.item();

      if (!currentItem || currentItem.availableTickets === 0) {
        this.setSelectableQuantities(0);
        this.totalPrice.set(0);
      } else {
        this.setSelectableQuantities(currentItem.availableTickets);
        this.totalPrice.set(currentItem.pricePerTicket * currentItem.quantity);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.item() && this.selectElement) {
      this.selectElement.nativeElement.value = this.item()!.quantity.toString();
    }
  }

  setSelectableQuantities(availableTickets: number): void {
    const maxQuantity = Math.min(availableTickets, 20);
    const selectNumber = Array.from({ length: maxQuantity }, (_, i) => i + 1);
    this.selectableQuantities.set(selectNumber);
  }

  onQuantityChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newQuantity = parseInt(target.value, 10);

    const item = this.item()!;
    const eventId = item.eventId;

    this.quantityChange.emit({ eventId, quantity: newQuantity });
    this.totalPrice.set(item.pricePerTicket * newQuantity);
  }

  onRemoveClicked() {
    const eventId = this.item()!.eventId;
    this.itemRemove.emit(eventId);
  }
}
