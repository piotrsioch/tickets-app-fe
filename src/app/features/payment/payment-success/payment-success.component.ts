import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'tickets-payment-success',
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss',
})
export class PaymentSuccessComponent {
  router = inject(Router);
  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;

  goToOrderHistory() {
    this.router.navigate(['/history']);
  }
}
