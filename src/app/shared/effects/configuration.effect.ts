import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { configurationActions } from '../reducers/configuration.reducer';

const CONFIGURATIONS_ENDPOINT = '/configurations';

@Injectable()
export class ConfigurationEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getConfiguration(): Observable<Action> {
    return this.actions$
      .ofType(configurationActions.CONFIGURATIONS_GET_REQUEST)
      .switchMap(action => this.api.get(`${CONFIGURATIONS_ENDPOINT}/${action.payload}`)
        .map(res => ({type: configurationActions.CONFIGURATIONS_GET, payload: res}))
        .catch((res) => Observable.of({type: configurationActions.CONFIGURATIONS_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  createConfiguration(): Observable<Action> {
    return this.actions$
      .ofType(configurationActions.CONFIGURATIONS_CREATE_REQUEST)
      .switchMap(action => this.api.post(CONFIGURATIONS_ENDPOINT, action.payload)
        .map(res => ({type: configurationActions.CONFIGURATIONS_CREATE, payload: res}))
        .catch(res => Observable.of({type: configurationActions.CONFIGURATIONS_CREATE_FAIL, payload: res}))
      );
  }

  @Effect()
  deleteConfiguration(): Observable<Action> {
    return this.actions$
      .ofType(configurationActions.CONFIGURATIONS_DELETE_REQUEST)
      .switchMap(action => this.api.remove(`${CONFIGURATIONS_ENDPOINT}/${action.payload}`)
        .map(res => ({type: configurationActions.CONFIGURATIONS_DELETE, payload: res}))
        .catch(res => Observable.of({type: configurationActions.CONFIGURATIONS_DELETE_FAIL, payload: res}))
      );
  }
}
