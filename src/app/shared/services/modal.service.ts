import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { firstValueFrom } from 'rxjs';

export enum ModalStyle {
  Small = 'tickets-small-modal',
  Default = 'tickets-modal',
  ConfirmModal = 'tickets-confirm-modal',
}
/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modal = inject(MatDialog);

  open<C, D = any, R = any>(
    component: ComponentType<C>,
    config: { data?: D; style?: ModalStyle } = { style: ModalStyle.Default }
  ): Promise<R | undefined> {
    const close$ = this.modal
      .open<C, D, R>(component, {
        data: config.data,
        panelClass: ['tickets-modal', config.style || ModalStyle.Default],
      })
      .afterClosed();

    return firstValueFrom(close$);
  }
}
