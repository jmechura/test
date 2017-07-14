import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'mss-date-picker-input',
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss']
})
export class DatePickerInputComponent {

  @Input() pickedDate: Moment = moment();
  @Output() pickedDateChange = new EventEmitter<Moment>();
  private label: string;

  calendarHidden = true;

  constructor(private language: LanguageService) {
    this.label = this.language.translate('components.datePicker.placeholder');
  }

  toggleCalendar(): void {
    this.calendarHidden = !this.calendarHidden;
  }

  submitDate(newDate: Moment): void {
    this.pickedDateChange.emit(moment(newDate));
    this.toggleCalendar();
  }

  get dateLabel(): string {
    return this.pickedDate != null ? this.pickedDate.format('D. M. YYYY') : this.label;
  }
}
