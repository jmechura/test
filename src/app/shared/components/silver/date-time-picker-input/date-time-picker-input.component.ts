import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mss-date-time-picker-input',
  templateUrl: './date-time-picker-input.component.html',
  styleUrls: ['./date-time-picker-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerInputComponent),
    multi: true,
  }]
})
export class DateTimePickerInputComponent implements ControlValueAccessor {

  @Input() pickedDate: Moment = moment();
  @Output() pickedDateChange = new EventEmitter<Moment>();

  calendarHidden = true;

  private changeCallback: any;
  private touchedCallback: any;

  disabled = false;

  toggleCalendar(): void {
    this.calendarHidden = !this.calendarHidden;
  }

  get submitTime(): Moment {
    return this.pickedDate;
  }

  set submitTime(newDate: Moment) {
    this.pickedDate = moment(newDate);
    this.pickedDateChange.emit(this.pickedDate);
    if (this.changeCallback) {
      this.changeCallback(this.pickedDate);
    }
  }

  get dateLabel(): string {
    return this.pickedDate != null ? this.pickedDate.format('D. M. YYYY HH:mm') : 'Vyberte datum';
  }

  writeValue(obj: any): void {
    this.pickedDate = obj;
  }

  registerOnChange(fn: any): void {
    this.changeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedCallback = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
