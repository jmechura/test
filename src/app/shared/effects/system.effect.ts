import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { systemsActions } from '../reducers/system.reducer';

const SYSTEMS_ENDPOINT_LIST = '/systems/list';

@Injectable()
export class SystemsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getSystems(): Observable<Action> {
    return this.actions$
      .ofType(systemsActions.SYSTEMS_GET_REQUEST)
      .switchMap(action => this.api.get(SYSTEMS_ENDPOINT_LIST)
        .map(res => ({type: systemsActions.SYSTEMS_GET, payload: res}))
        .catch((res) => Observable.of({type: systemsActions.SYSTEMS_GET_FAIL, payload: res}))
      );
  }
}
