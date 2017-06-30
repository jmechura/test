import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { userResourceActions } from '../reducers/user-resource.reducer';

const USER_RESOURCE_ENDPOINT = '/users/resources';

@Injectable()
export class UserResourceEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getUserResource(): Observable<Action> {
    return this.actions$
      .ofType(userResourceActions.USER_RESOURCE_GET_REQUEST)
      .switchMap(action => this.api.get(USER_RESOURCE_ENDPOINT)
        .map(res => ({type: userResourceActions.USER_RESOURCE_GET, payload: res}))
        .catch((res) => Observable.of({type: userResourceActions.USER_RESOURCE_GET_FAIL, payload: res}))
      );
  }
}
