import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'tickets-toast',
  imports: [MatIcon, NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  toastService = inject(ToastService);

  toast = this.toastService.toast;

  onClose() {
    this.toastService.clear();
  }
}
