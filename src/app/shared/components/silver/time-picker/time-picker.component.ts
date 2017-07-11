import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'mss-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent {

  @Input()
  set pickedTime(newTime: Moment) {
    this.time = newTime ? newTime : moment();
  }

  @Output() pickedTimeChange = new EventEmitter<Moment>();

  time: Moment = moment();

  changeTime(increment: boolean, granularity: 'hours' | 'minutes'): void {
    increment ? this.time.add(1, granularity) : this.time.subtract(1, granularity);
    this.pickedTimeChange.emit(moment(this.time));
  }
}
