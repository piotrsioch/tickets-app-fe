import {Component, inject} from '@angular/core';
import {DateTimePickerComponent} from '../../shared/components/date-picker/date-time-picker.component';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'tickets-home',
  imports: [
    DateTimePickerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    eventDate: new FormControl<Date | null>(new Date('2025-07-01T17:45:00.000Z'))
  });

  ngOnInit() {
    this.form.get('eventDate')?.valueChanges.subscribe((value) => {
      console.log('🕓 Zmieniona data i godzina:', value);
    });
  }
}
