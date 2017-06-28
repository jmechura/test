import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionTypesActions } from '../reducers/transaction-type.reducer';
const AUTH_ENDPOINT = '/trxs/types';

@Injectable()
export class TransactionTypeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTypes(): Observable<Action> {
    return this.actions$
      .ofType(transactionTypesActions.TRANSACTION_TYPES_GET_REQUEST)
      .switchMap(action => this.api.get(AUTH_ENDPOINT)
        .map(res => ({type: transactionTypesActions.TRANSACTION_TYPES_GET, payload: res}))
        .catch((res) => Observable.of({type: transactionTypesActions.TRANSACTION_TYPES_GET_FAIL, payload: res}))
      );
  }
}
