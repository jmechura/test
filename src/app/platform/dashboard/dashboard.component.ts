import { Component, OnDestroy } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import * as moment from 'moment';
import { Moment } from 'moment';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { transactionActions } from '../../shared/reducers/transaction.reducer';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'mss-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {

  options: SelectItem[] = [{value: 'all'}, {value: 'female'}, {value: 'male'}];
  selected = 'all';
  completeArray: any[] = [];
  fileterArray: any[] = [];
  fromDate: Moment = moment();
  toDate: Moment = moment();
  private unsubscribe = new Subject<void>();

  constructor(private store: Store<AppState>) {
    this.fetch((data) => {
      this.completeArray = data;
      this.fileterArray = data;
    });

    this.store.dispatch({type: transactionActions.TRANSACTION_GET, payload: {}});
    this.store.select('transactions').takeUntil(this.unsubscribe).subscribe(
      (data: StateModel<Transaction>) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
      }
    );
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
