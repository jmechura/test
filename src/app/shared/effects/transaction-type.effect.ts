import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionTypesActions } from '../reducers/transactionType.reducer';
const AUTH_ENDPOINT = '/trxs/types';

@Injectable()
export class TransactionTypeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTypes(): Observable<Action> {
    return this.actions$
      .ofType(transactionTypesActions.TYPES_GET)
      .switchMap(action => this.api.get(AUTH_ENDPOINT)
        .map(res => ({type: transactionTypesActions.TYPES_SUCCESS, payload: res}))
        .catch((res) => Observable.of({type: transactionTypesActions.TYPES_FAILURE, payload: res}))
      );
  }
}
