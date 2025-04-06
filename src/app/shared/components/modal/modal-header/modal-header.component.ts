import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tickets-modal-header',
  imports: [],
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.scss',
})
export class ModalHeaderComponent {
  title = input.required<string>();
  closeClicked = output<void>();

  close() {
    this.closeClicked.emit();
  }
}
