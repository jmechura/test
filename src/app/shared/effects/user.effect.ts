import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { userActions } from '../reducers/user.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const USER_ENDPOINT = '/users';

@Injectable()
export class UserEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect()
  getUser(): Observable<Action> {
    return this.actions$
      .ofType(userActions.USER_GET_REQUEST)
      .switchMap(action => this.api.get(`${USER_ENDPOINT}/${action.payload}`)
        .map(res => ({type: userActions.USER_GET, payload: res}))
        .catch((res) => Observable.of({type: userActions.USER_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  updateUser(): Observable<Action> {
    return this.actions$
      .ofType(userActions.USER_PUT_REQUEST)
      .switchMap(action => this.api.put(USER_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updateUser');
          return {type: userActions.USER_PUT, payload: res};
        })
        .catch((res) => {
          this.toastr.error(res);
          return Observable.of({type: userActions.USER_PUT_FAIL, payload: res});
        })
      );
  }
}
