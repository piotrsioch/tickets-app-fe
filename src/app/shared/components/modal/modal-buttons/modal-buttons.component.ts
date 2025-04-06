import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tickets-modal-buttons',
  imports: [],
  templateUrl: './modal-buttons.component.html',
  styleUrl: './modal-buttons.component.scss',
})
export class ModalButtonsComponent {
  closeText = input<string>('Cancel');
  saveText = input<string>('Save');
  disabled = input<boolean>(false);
  savedClicked = output<boolean>();

  close(savedClicked: boolean) {
    this.savedClicked.emit(savedClicked);
  }
}
