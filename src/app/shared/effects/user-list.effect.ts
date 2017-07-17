import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { userListActions } from '../reducers/user-list.reducer';

const USER_ENDPOINT = '/users';

@Injectable()
export class UserListEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getUsers(): Observable<Action> {
    return this.actions$
      .ofType(userListActions.USER_LIST_GET_REQUEST)
      .switchMap(action => this.api.post(`${USER_ENDPOINT}/list`, action.payload)
        .map(res => ({type: userListActions.USER_LIST_GET, payload: res}))
        .catch((res) => Observable.of({type: userListActions.USER_LIST_GET_FAIL, payload: res}))
      );
  }
}
