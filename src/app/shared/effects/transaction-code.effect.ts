import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionCodesActions } from '../reducers/transaction-code.reducer';
const AUTH_ENDPOINT = '/trxs/codes';

@Injectable()
export class TransactionCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCodes(): Observable<Action> {
    return this.actions$
      .ofType(transactionCodesActions.TRANSACTION_CODES_GET_REQUEST)
      .switchMap(action => this.api.get(AUTH_ENDPOINT)
        .map(res => ({type: transactionCodesActions.TRANSACTION_CODES_GET, payload: res}))
        .catch((res) => Observable.of({type: transactionCodesActions.TRANSACTION_CODES_GET_FAIL, payload: res}))
      );
  }
}
