import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionStatesActions } from '../reducers/transaction-state.reducer';
const AUTH_ENDPOINT = '/trxs/states';

@Injectable()
export class TransactionStateEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getStates(): Observable<Action> {
    return this.actions$
      .ofType(transactionStatesActions.TRANSACTION_STATES_GET_REQUEST)
      .switchMap(action => this.api.get(AUTH_ENDPOINT)
        .map(res => ({type: transactionStatesActions.TRANSACTION_STATES_GET, payload: res}))
        .catch((res) => Observable.of({type: transactionStatesActions.TRANSACTION_STATES_GET_FAIL, payload: res}))
      );
  }
}
