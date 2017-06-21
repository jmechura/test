import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { authActions } from '../reducers/auth.reducer';
import { ApiService } from '../services/api.service';

const AUTH_ENDPOINT = '/rest/login';

@Injectable()
export class AuthEffect {
  constructor(private api: ApiService, private actions$: Actions) {}

  @Effect() login(): Observable<Action> {
    return this.actions$
      .ofType(authActions.LOGIN_REQUEST)
      .switchMap(action => this.api.post(AUTH_ENDPOINT, action.payload)
        .map(res => ({type: authActions.LOGIN_SUCCESS, payload: res}))
        .catch(() => Observable.of({type: authActions.LOGIN_FAILURE}))
      );
  }
}
