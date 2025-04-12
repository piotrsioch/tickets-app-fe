import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../../features/cart/cart.service';
import { inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { ToastSeverity } from '../../core/services/types/toast.model';

export const CartNotEmptyGuard: CanActivateFn = () => {
  const cartService = inject(CartService);
  const toastService = inject(ToastService);
  const router = inject(Router);
  const cartItems = cartService.items();

  if (cartItems.length === 0) {
    router.navigateByUrl('/');
    toastService.show('You cannot access checkout with empty cart', ToastSeverity.WARNING);
    return false;
  }

  return true;
};
