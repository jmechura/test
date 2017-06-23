import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'mss-date-picker-input',
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss']
})
export class DatePickerInputComponent {

  @Input() pickedDate: Moment = moment();
  @Output() pickedDateChange = new EventEmitter<Moment>();

  calendarHidden = true;

  toggleCalendar(): void {
    this.calendarHidden = !this.calendarHidden;
  }

  submitDate(newDate: Moment): void {
    this.pickedDateChange.emit(moment(newDate));
    this.toggleCalendar();
  }

  get dateLabel(): string {
    return this.pickedDate != null ? this.pickedDate.format('D. M. YYYY') : 'Vyberte datum';
  }
}
