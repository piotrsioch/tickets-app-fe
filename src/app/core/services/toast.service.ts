import { effect, Injectable, signal } from '@angular/core';
import { Toast, ToastSeverity } from './types/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  #toastSignal = signal<Toast | null>(null);
  toast = this.#toastSignal.asReadonly();

  constructor() {
    effect(() => {
      if (this.#toastSignal()) {
        setTimeout(() => {
          this.#toastSignal.set(null);
        }, 10000);
      }
    });
  }

  show(text: string, severity: ToastSeverity) {
    this.#toastSignal.set({ text, severity });
  }

  clear() {
    this.#toastSignal.set(null);
  }
}
