import { Component, inject } from '@angular/core';
import { ModalButtonsComponent } from '../../../shared/components/modal/modal-buttons/modal-buttons.component';
import { ModalHeaderComponent } from '../../../shared/components/modal/modal-header/modal-header.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'tickets-add-to-card-modal',
  imports: [ModalButtonsComponent, ModalHeaderComponent],
  templateUrl: './add-to-card-modal.component.html',
  styleUrl: './add-to-card-modal.component.scss',
})
export class AddToCardModalComponent {
  dialogRef = inject(MatDialogRef);

  close() {
    this.dialogRef.close();
  }

  onSave(wasContinueShoppingClicked: boolean) {
    this.dialogRef.close(wasContinueShoppingClicked);
  }
}
