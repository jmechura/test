import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionCodesActions } from '../reducers/transactionCode.reducer';
const AUTH_ENDPOINT = '/trxs/codes';

@Injectable()
export class TransactionCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCodes(): Observable<Action> {
    return this.actions$
      .ofType(transactionCodesActions.CODES_GET)
      .switchMap(action => this.api.get(AUTH_ENDPOINT)
        .map(res => ({type: transactionCodesActions.CODES_SUCCESS, payload: res}))
        .catch((res) => Observable.of({type: transactionCodesActions.CODES_FAILURE, payload: res}))
      );
  }
}
