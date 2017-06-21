import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { accountActions } from '../reducers/account.reducer';

const ACCOUNT_ENDPOINT = '/account';
const ACCOUNT_UPDATE_ENDPOINT = '/users';

@Injectable()
export class AccountEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getAccount(): Observable<Action> {
    return this.actions$
      .ofType(accountActions.ACCOUNT_API_GET)
      .switchMap(action => this.api.get(ACCOUNT_ENDPOINT)
        .map(res => ({type: accountActions.ACCOUNT_GET, payload: res}))
        .catch(res => Observable.of({type: accountActions.ACCOUNT_API_GET_FAIL, payload: res}))
      );
  }

  @Effect() updateAccount(): Observable<Action> {
    return this.actions$
      .ofType(accountActions.ACCOUNT_API_PUT)
      .switchMap(action => this.api.put(ACCOUNT_UPDATE_ENDPOINT, action.payload)
        .map(res => ({type: accountActions.ACCOUNT_PUT, payload: res}))
        .catch(res => Observable.of({type: accountActions.ACCOUNT_API_PUT_FAIL, payload: res}))
      );
  }
}
