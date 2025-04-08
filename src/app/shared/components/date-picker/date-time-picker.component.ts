import {Component, forwardRef} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'tickets-date-time-picker',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatTimepickerModule],
  providers: [
    provideNativeDateAdapter(), {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerComponent),
    multi: true,
  },
  ],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.scss'
})
export class DateTimePickerComponent implements ControlValueAccessor {
  disabled = false;
  value: Date = new Date();

  onChange = (value: Date) => {};
  onTouched = () => {};

  writeValue(obj: Date): void {
    if (obj) {
      this.value = new Date(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateDate(date: Date) {
    const updated = new Date(this.value);
    updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.value = updated;
    this.onChange(this.value);
  }

  updateTime(time: Date) {
    const updated = new Date(this.value);
    updated.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    this.value = updated;
    this.onChange(this.value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
