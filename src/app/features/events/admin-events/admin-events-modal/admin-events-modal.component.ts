// import {Component, inject} from '@angular/core';
// import {ToastSeverity} from '../../../../core/services/types/toast.model';
// import {CreateEvent, Event, EventsApiService} from '../../../../core/api/events';
// import {ToastService} from '../../../../core/services/toast.service';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
// import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
// import {ModalButtonsComponent} from '../../../../shared/components/modal/modal-buttons/modal-buttons.component';
// import {ModalHeaderComponent} from '../../../../shared/components/modal/modal-header/modal-header.component';
// import {EventModalData} from './admin-events-modal.model';
//
// @Component({
//   selector: 'tickets-admin-events-modal',
//   imports: [
//     ModalButtonsComponent,
//     ReactiveFormsModule,
//     ModalHeaderComponent
//   ],
//   templateUrl: './admin-events-modal.component.html',
//   styleUrl: './admin-events-modal.component.scss'
// })
// export class AdminEventsModalComponent {
//   eventsApiService = inject(EventsApiService);
//   toastService = inject(ToastService);
//   dialogRef = inject(MatDialogRef);
//   data: EventModalData = inject(MAT_DIALOG_DATA);
//   formBuilder = inject(FormBuilder);
//
//   form = this.formBuilder.group({
//     name: ['', { nonNullable: true }],
//     eventDate: [null, { nonNullable: true }],
//     venue: ['', { nonNullable: true }],
//     availableTickets: [0, { nonNullable: true }],
//     pricePerTicket: [0, { nonNullable: true }],
//     salesStartDate: [null, { nonNullable: true }],
//     salesEndDate: [null, { nonNullable: true }],
//     duration: [0, { nonNullable: true }],
//   });
//
//   ngOnInit() {
//     if (this.data?.event) {
//       this.form.patchValue({
//         name: this.data.event.name,
//         eventDate: new Date(this.data.event.eventDate),  // Przekształcenie na Date
//         venue: this.data.event.venue,
//         availableTickets: this.data.event.availableTickets,
//         pricePerTicket: this.data.event.pricePerTicket,
//         salesStartDate: new Date(this.data.event.salesStartDate), // Przekształcenie na Date
//         salesEndDate: new Date(this.data.event.salesEndDate), // Przekształcenie na Date
//         duration: this.data.event.duration,
//       });
//     }
//   }
//
//   async onSave(wasSaveClicked: boolean) {
//     if (!wasSaveClicked) {
//       this.close();
//     }
//
//     const { name, eventDate, venue, availableTickets, pricePerTicket, salesStartDate, salesEndDate, duration } = this.form.value as Partial<Event>;
//
//     if (!name || !venue) {
//       this.toastService.show('Name and venue are required', ToastSeverity.ERROR);
//       return;
//     }
//
//     const isFormDataDifferent = this.isFormDataDifferentFromPassedValue();
//
//     if (isFormDataDifferent) {
//       this.data.mode === 'create'
//         ? await this.createEvent({ name, eventDate, venue, availableTickets, pricePerTicket, salesStartDate, salesEndDate, duration })
//         : await this.updateEvent(this.data.event!.id, { name, eventDate, venue, availableTickets, pricePerTicket, salesStartDate, salesEndDate, duration });
//     }
//   }
//
//   close() {
//     this.dialogRef.close();
//   }
//
//   private isFormDataDifferentFromPassedValue() {
//     const formValue = this.form.value;
//     const original = this.data?.event;
//
//     if (!original) return true;
//
//     return (
//       formValue.name !== original.name ||
//       formValue.venue !== original.venue ||
//       formValue.availableTickets !== original.availableTickets ||
//       formValue.pricePerTicket !== original.pricePerTicket ||
//       formValue.salesStartDate !== original.salesStartDate ||
//       formValue.salesEndDate !== original.salesEndDate ||
//       formValue.duration !== original.duration
//     );
//   }
//
//   private async createEvent(event: CreateEvent): Promise<void> {
//     try {
//       const newEvent = await this.eventsApiService.createEvent(event);
//       this.toastService.show('Event created', ToastSeverity.SUCCESS);
//       this.dialogRef.close(newEvent);
//     } catch (error) {
//       console.error(error);
//       this.toastService.show('Error creating event', ToastSeverity.ERROR);
//     }
//   }
//
//   private async updateEvent(id: number, event: Partial<Event>) {
//     try {
//       const updatedEvent = await this.eventsApiService.updateEvent(id, event);
//       this.toastService.show('Event updated', ToastSeverity.SUCCESS);
//       this.dialogRef.close(updatedEvent);
//     } catch (error) {
//       console.error(error);
//       this.toastService.show('Error updating event', ToastSeverity.ERROR);
//     }
//   }
// }
