import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { userAuthorityActions } from '../reducers/user-authorities.reducer';

const USER_AUTHORITY_ENDPOINT = '/users/authorities';

@Injectable()
export class UserAuthoritiesEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getUserAuthority(): Observable<Action> {
    return this.actions$
      .ofType(userAuthorityActions.USER_AUTHORITY_GET_REQUEST)
      .switchMap(action => this.api.get(USER_AUTHORITY_ENDPOINT)
        .map(res => ({type: userAuthorityActions.USER_AUTHORITY_GET, payload: res}))
        .catch((res) => Observable.of({type: userAuthorityActions.USER_AUTHORITY_GET_FAIL, payload: res}))
      );
  }
}
