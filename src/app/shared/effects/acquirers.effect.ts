import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { acquirerActions } from '../reducers/acquirers.reducer';

const ACQUIRERS_ENDPOINT_LIST = '/networks/list';

@Injectable()
export class AcquirersEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getAcquirers(): Observable<Action> {
    return this.actions$
      .ofType(acquirerActions.ACQUIRERS_GET_REQUEST)
      .switchMap(action => this.api.post(ACQUIRERS_ENDPOINT_LIST, action.payload)
        .map(res => ({type: acquirerActions.ACQUIRERS_GET, payload: res}))
        .catch((res) => Observable.of({type: acquirerActions.ACQUIRERS_GET_FAIL, payload: res}))
      );
  }
}
