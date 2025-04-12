import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { ToastSeverity } from '../../core/services/types/toast.model';
import { OrdersApiService } from '../../core/api/orders';

export const PaymentIntentGuard: CanActivateFn = async route => {
  const ordersApiService = inject(OrdersApiService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const orderId = route.queryParamMap.get('orderId');
  const clientSecret = route.queryParamMap.get('clientSecret');

  if (!orderId || !clientSecret) {
    router.navigateByUrl('/unauthorized');
    return false;
  }

  try {
    const order = await ordersApiService.getOrderById(orderId);

    if (order?.clientSecret !== clientSecret) {
      toastService.show('Invalid payment data', ToastSeverity.ERROR);
      router.navigateByUrl('/cart');
      return false;
    }

    return true;
  } catch (_) {
    toastService.show('Error during fetching payment data', ToastSeverity.ERROR);
    router.navigateByUrl('/cart');
    return false;
  }
};
