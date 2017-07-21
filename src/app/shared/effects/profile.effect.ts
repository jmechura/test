import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { profileActions } from '../reducers/profile.reducer';

const PROFILE_GET_ENDPOINT = '/account';
const PROFILE_UPDATE_ENDPOINT = '/users';

@Injectable()
export class ProfileEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  get(): Observable<Action> {
    return this.actions$
      .ofType(profileActions.PROFILE_GET_REQUEST)
      .switchMap(action => this.api.get(PROFILE_GET_ENDPOINT)
        .map(res => ({type: profileActions.PROFILE_GET, payload: res}))
        .catch(res => Observable.of({type: profileActions.PROFILE_GET_ERROR, payload: res}))
      );
  }

  @Effect()
  update(): Observable<Action> {
    return this.actions$
      .ofType(profileActions.PROFILE_PUT_REQUEST)
      .switchMap(action => this.api.put(PROFILE_UPDATE_ENDPOINT, action.payload)
        .map(res => ({type: profileActions.PROFILE_PUT, payload: res}))
        .catch(res => Observable.of({type: profileActions.PROFILE_PUT_ERROR, payload: res}))
      );
  }

  @Effect()
  discard(): Observable<Action> {
    return this.actions$
      .ofType(profileActions.PROFILE_DISCARD)
      .switchMap(() => {
        this.api.discardToken();
        return Observable.empty();
      });
  }
}
