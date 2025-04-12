import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tickets-payment',
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);

  clientSecret: string | null = null;
  orderId: string | null = null;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.clientSecret = params.get('clientSecret');
      this.orderId = params.get('orderId');
    });
  }
}
