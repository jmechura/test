import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'mss-date-time-picker-input',
  templateUrl: './date-time-picker-input.component.html',
  styleUrls: ['./date-time-picker-input.component.scss']
})
export class DateTimePickerInputComponent {

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

  submitTime(newDate: Moment): void {
    this.pickedDateChange.emit(moment(newDate));
  }

  get dateLabel(): string {
    return this.pickedDate != null ? this.pickedDate.format('D. M. YYYY HH:mm') : 'Vyberte datum';
  }
}
