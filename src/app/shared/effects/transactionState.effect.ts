import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionStatesActions } from '../reducers/transactionState.reducer';
const AUTH_ENDPOINT = '/trxs/states';

@Injectable()
export class TransactionStateEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getStates(): Observable<Action> {
    return this.actions$
      .ofType(transactionStatesActions.STATES_GET)
      .switchMap(action => this.api.get(AUTH_ENDPOINT)
        .map(res => ({type: transactionStatesActions.STATES_SUCCESS, payload: res}))
        .catch((res) => Observable.of({type: transactionStatesActions.STATES_FAILURE, payload: res}))
      );
  }
}
