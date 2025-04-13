import {Component, inject, OnInit, signal} from '@angular/core';
import { ToastSeverity } from '../../../core/services/types/toast.model';
import { CreateEvent, EventModel, EventsApiService } from '../../../core/api/events';
import { ToastService } from '../../../core/services/toast.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalButtonsComponent } from '../../../shared/components/modal/modal-buttons/modal-buttons.component';
import { ModalHeaderComponent } from '../../../shared/components/modal/modal-header/modal-header.component';
import { EventModalData } from './admin-events-modal.model';
import { DateTimePickerComponent } from '../../../shared/components/date-picker/date-time-picker.component';
import {CategoriesApiService, Category} from '../../../core/api/categories';

@Component({
  selector: 'tickets-admin-events-modal',
  imports: [
    ModalButtonsComponent,
    ReactiveFormsModule,
    ModalHeaderComponent,
    ReactiveFormsModule,
    DateTimePickerComponent,
  ],
  providers: [],
  templateUrl: './admin-events-modal.component.html',
  styleUrl: './admin-events-modal.component.scss',
})
export class AdminEventsModalComponent implements OnInit {
  categoriesApiService = inject(CategoriesApiService);
  eventsApiService = inject(EventsApiService);
  toastService = inject(ToastService);
  dialogRef = inject(MatDialogRef);
  data: EventModalData = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  mainCategories = signal<Category[]>([]);

  form = this.formBuilder.group({
    name: new FormControl<string | null>(null),
    eventDate: new FormControl<Date | null>(null),
    venue: new FormControl<string | null>(null),
    availableTickets: new FormControl<number | null>(null),
    pricePerTicket: new FormControl<number | null>(null),
    mainCategoryId: new FormControl<number | null>(null),
    subcategoriesId: new FormControl<number[] | null>(null),
    salesStartDate: new FormControl<Date | null>(null),
    salesEndDate: new FormControl<Date | null>(null),
    duration: new FormControl<number | null>(null),
  });

  ngOnInit() {
    this.getMainCategories().then(() => {
      if (this.data?.event) {
        const mainCategoryId = this.data.event.mainCategory?.id ?? null;
        console.log(this.data.event.mainCategory)
        this.form.patchValue({
          name: this.data.event.name,
          eventDate: new Date(this.data.event.eventDate),
          venue: this.data.event.venue,
          mainCategoryId,
          subcategoriesId: this.data.event.subcategoriesIds,
          availableTickets: this.data.event.availableTickets,
          pricePerTicket: this.data.event.pricePerTicket,
          salesStartDate: new Date(this.data.event.salesStartDate),
          salesEndDate: new Date(this.data.event.salesEndDate),
          duration: this.data.event.duration,
        });
      }
    })
  }

  async onSave(wasSaveClicked: boolean) {
    if (!wasSaveClicked) {
      this.close();
    }

    const {
      name,
      eventDate,
      venue,
      availableTickets,
      pricePerTicket,
      salesStartDate,
      salesEndDate,
      duration,
      mainCategoryId,
      subcategoriesIds,
    } = this.form.value as Partial<EventModel>;

    if (
      !name ||
      !venue ||
      !eventDate ||
      !availableTickets ||
      !pricePerTicket ||
      !salesStartDate ||
      !salesEndDate ||
      !duration ||
      !mainCategoryId
    ) {
      this.toastService.show('You need to pass all fields', ToastSeverity.ERROR);
      return;
    }

    const isFormDataDifferent = this.isFormDataDifferentFromPassedValue();

    if (isFormDataDifferent) {
      this.data.mode === 'create'
        ? await this.createEvent({
            name,
            eventDate,
            venue,
            availableTickets,
            pricePerTicket,
            salesStartDate,
            salesEndDate,
            duration,
            mainCategoryId,
            subcategoriesIds,
          })
        : await this.updateEvent(this.data.event!.id, {
            name,
            eventDate,
            venue,
            availableTickets,
            pricePerTicket,
            salesStartDate,
            salesEndDate,
            duration,
          mainCategoryId
          });
    }
  }

  close() {
    this.dialogRef.close();
  }

  changeMainCategoryId(event: any) {
    const categoryId = event.target.value;
    console.log(categoryId);
    const id = parseInt(categoryId, 10);
    if (!isNaN(id)) {
      this.form.patchValue({ mainCategoryId: id });
      console.log(this.form.value.mainCategoryId);
    }
  }

  private isFormDataDifferentFromPassedValue() {
    const formValue = this.form.value;
    const original = this.data?.event;

    if (!original) return true;

    return (
      formValue.name !== original.name ||
      formValue.venue !== original.venue ||
      formValue.availableTickets !== original.availableTickets ||
      formValue.pricePerTicket !== original.pricePerTicket ||
      formValue.salesStartDate !== original.salesStartDate ||
      formValue.salesEndDate !== original.salesEndDate ||
      formValue.duration !== original.duration
    );
  }

  private async createEvent(event: CreateEvent): Promise<void> {
    try {
      const newEvent = await this.eventsApiService.createEvent(event);
      this.toastService.show('Event created', ToastSeverity.SUCCESS);
      this.dialogRef.close(newEvent);
    } catch (error) {
      console.error(error);
      this.toastService.show('Error creating event', ToastSeverity.ERROR);
    }
  }

  private async updateEvent(id: number, event: Partial<EventModel>) {
    try {
      const updatedEvent = await this.eventsApiService.updateEvent(id, event);
      this.toastService.show('Event updated', ToastSeverity.SUCCESS);
      this.dialogRef.close(updatedEvent);
    } catch (error) {
      console.error(error);
      this.toastService.show('Error updating event', ToastSeverity.ERROR);
    }
  }

  private async getMainCategories(): Promise<void> {
    const categories = await this.categoriesApiService.getMainCategories({ page: 0, limit: 0});
    this.mainCategories.set(categories.items);
  }
}
