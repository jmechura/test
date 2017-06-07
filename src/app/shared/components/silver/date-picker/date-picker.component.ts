import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

@Component({
  selector: 'mss-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {

  @Input() pickedDate: Moment = moment();
  @Output() pickedDateChange = new EventEmitter<Moment>();

  dayHeaders = DAYS_SHORT;
  actualDaysInMonth: Moment[][];

  selectedMonth: Moment;

  constructor() {
    this.selectedMonth = moment(this.pickedDate).date(1);
    this.actualDaysInMonth = this.constructCalendar();
  }

  /**
   * Fills [][] with Moment objects representing currently selected month
   * Also adds days from previous and next month to fill full weeks
   * @returns {Array}
   */
  constructCalendar(): Moment[][] {
    const daysInPreviousMonth = (this.selectedMonth.day() + 6) % 7;
    const firstDateOfCalendar = moment(this.selectedMonth).subtract(daysInPreviousMonth, 'days');
    const numberOfWeeks = Math.ceil((this.selectedMonth.daysInMonth() + daysInPreviousMonth) / 7);
    return Array(numberOfWeeks).fill([])
      .map((week, indexWeek) => Array(7).fill([])
        .map((day, indexDay) => moment(firstDateOfCalendar).add((indexWeek * 7) + indexDay, 'days'))
      );
  }

  /**
   * Called on clicking on arrow buttons
   * Increments or decrements currently selected month
   * @param increment
   */
  monthSelect(increment: boolean): void {
    increment ? this.selectedMonth.add(1, 'month') : this.selectedMonth.subtract(1, 'month');
    this.actualDaysInMonth = this.constructCalendar();
  }


  pickDay(day: Moment): void {
    this.pickedDateChange.emit(moment(day));
  }

  isSelectedDate(day: Moment): boolean {
    return moment(this.pickedDate).isSame(moment(day), 'day');
  }
}
