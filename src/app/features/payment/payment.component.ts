import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stripe, StripeElements } from '@stripe/stripe-js';
import { StripeService } from './stripe.service';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'tickets-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  stripeService = inject(StripeService);
  loadingService = inject(LoadingService);

  clientSecret: string | null = null;
  orderId: string | null = null;

  #stripe: Stripe | null = null;
  #elements: StripeElements | null = null;

  ngOnInit() {
    this.initializeStripe();
  }

  async initializeStripe() {
    this.loadingService.loadingOn();
    this.route.queryParamMap.subscribe(params => {
      this.clientSecret = params.get('clientSecret');
      this.orderId = params.get('orderId');
    });

    this.#stripe = await this.stripeService.getStripe();

    await this.setupStripeElements();
    this.loadingService.loadingOff();
  }

  async setupStripeElements() {
    if (!this.#stripe || !this.clientSecret) {
      return;
    }

    this.#elements = this.#stripe.elements({ clientSecret: this.clientSecret });

    const paymentElement = this.#elements.create('payment');
    paymentElement.mount('#payment-element');

    return new Promise<void>((resolve, _reject) => {
      paymentElement.on('ready', () => {
        resolve();
      });
    });
  }

  async onPayClicked() {
    if (!this.#stripe || !this.#elements) return;

    const { error } = await this.#stripe.confirmPayment({
      elements: this.#elements,
      confirmParams: {
        return_url: window.location.origin + '/payment-success',
      },
    });

    if (error) {
      console.error('Payment error', error.message);
    }
  }
}
