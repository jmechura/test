import { Component } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'mss-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  options: SelectItem[] = [{value: 'all'}, {value: 'female'}, {value: 'male'}];
  selected = 'all';
  completeArray: any[] = [];
  fileterArray: any[] = [];
  fromDate: Moment = moment();
  toDate: Moment = moment();

  constructor() {
    this.fetch((data) => {
      this.completeArray = data;
      this.fileterArray = data;
    });
  }

  fetch(cb: any): void {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/mock/company.json`);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  changeFilter(filter: string): void {
    this.selected = filter;
    switch (filter) {
      case 'all' :
        this.fileterArray = this.completeArray;
        break;
      case 'female':
        this.fileterArray = this.completeArray.filter(item => item.gender === 'female');
        break;
      case 'male':
        this.fileterArray = this.completeArray.filter(item => item.gender === 'male');
        break;
      default :
        break;
    }
  }
}
