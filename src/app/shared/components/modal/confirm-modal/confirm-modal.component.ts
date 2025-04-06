import { Component, inject } from '@angular/core';
import { ModalHeaderComponent } from '../modal-header/modal-header.component';
import { ModalButtonsComponent } from '../modal-buttons/modal-buttons.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmModalData {
  title?: string;
  description: string;
}

@Component({
  selector: 'tickets-confirm-modal',
  imports: [ModalHeaderComponent, ModalButtonsComponent],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  data: ConfirmModalData = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConfirmModalComponent>);

  title = this.data.title || 'Are you sure?';
  description = this.data.description;

  close(wasSavedClicked?: boolean) {
    this.dialogRef.close(wasSavedClicked);
  }

  handleButtonClicked(wasSavedClicked: boolean) {
    wasSavedClicked ? this.close(true) : this.dialogRef.close();
  }
}
