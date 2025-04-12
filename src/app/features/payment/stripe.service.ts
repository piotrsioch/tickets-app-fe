import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripe: Stripe | null = null;

  async getStripe(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripePublicKey);
    }
    return this.stripe;
  }
}
