import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionActions } from '../reducers/transactions.reducer';
const TRANSACTION_ENDPOINT = '/trxs/list';

@Injectable()
export class TransactionsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTransactions(): Observable<Action> {
    return this.actions$
      .ofType(transactionActions.TRANSACTIONS_GET_REQUEST)
      .switchMap(action => this.api.post(
        TRANSACTION_ENDPOINT,
        action.payload)
        .map(res => ({type: transactionActions.TRANSACTIONS_GET, payload: res}))
        .catch((res) => Observable.of({type: transactionActions.TRANSACTIONS_GET_FAIL, payload: res}))
      );
  }
}
