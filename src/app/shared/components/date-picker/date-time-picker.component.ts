import { Component, forwardRef, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tickets-date-time-picker',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatTimepickerModule],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.scss',
})
export class DateTimePickerComponent implements ControlValueAccessor {
  fieldName = input.required<string>();
  disabled = false;
  value: Date | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (_value: Date | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  writeValue(obj: Date): void {
    if (obj) {
      this.value = new Date(obj);
    } else {
      this.value = null;
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  updateDate(date: Date) {
    const updated = this.value ? new Date(this.value) : new Date();
    updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.value = updated;
    this.onChange(this.value);
  }

  updateTime(time: Date) {
    const updated = this.value ? new Date(this.value) : new Date();
    updated.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    this.value = updated;
    this.onChange(this.value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
