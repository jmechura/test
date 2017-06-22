import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionActions } from '../reducers/transaction.reducer';
const TRANSACTION_ENDPOINT = '/trxs/list';

@Injectable()
export class TransactionsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTransactions(): Observable<Action> {
    return this.actions$
      .ofType(transactionActions.TRANSACTION_GET)
      .switchMap(action => this.api.post(
        TRANSACTION_ENDPOINT,
        {
          pagination: {
            number: 10,
            numberOfPages: 0,
            start: 0
          },
          sort: {},
          search: action.payload
        })
        .map(res => ({type: transactionActions.TRANSACTION_SUCCESS, payload: res}))
        .catch((res) => Observable.of({type: transactionActions.TRANSACTION_FAIL, payload: res}))
      );
  }
}
