import { Component, inject, signal } from '@angular/core';
import { CreateOrder, OrdersApiService } from '../../core/api/orders';
import { UsersApiService } from '../../core/api/users/users.api.service';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/api/users/types';
import { CartService } from '../cart/cart.service';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from '../../core/services/toast.service';
import { ToastSeverity } from '../../core/services/types/toast.model';

@Component({
  selector: 'tickets-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  toastService = inject(ToastService);
  authService = inject(AuthService);
  ordersApiService = inject(OrdersApiService);
  usersApiService = inject(UsersApiService);
  cartService = inject(CartService);
  loadingService = inject(LoadingService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  user = signal<User | null>(null);
  cartItems = this.cartService.items;

  form: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
  });

  constructor() {
    this.prefillUserData();
  }

  onBackClicked() {
    this.router.navigateByUrl('cart');
  }

  async onSubmit() {
    if (this.form.valid) {
      const cartItems = this.cartItems();
      const ticketsData = cartItems.map(data => ({ eventId: data.eventId, quantity: data.quantity }));
      const orderData: CreateOrder = {
        userId: this.user()?.id,
        ticketsData: ticketsData,
      };
      this.loadingService.loadingOn();
      try {
        const data = await this.ordersApiService.createOrder(orderData);
        this.router.navigate(['/payment'], {
          queryParams: {
            clientSecret: data.clientSecret,
            orderId: data.orderId,
          },
        });
      } catch (_error) {
        await this.router.navigate(['/events']);
        this.toastService.show('Tickets are no longer available', ToastSeverity.WARNING);
        this.loadingService.loadingOff();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  private async prefillUserData() {
    if (this.authService.isLoggedIn()) {
      try {
        const user = await this.usersApiService.getUserData();
        this.user.set(user);
        this.form.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
        });
      } catch (_) {
        console.error('Error druing fetching user data', _);
      }
    }
  }
}
