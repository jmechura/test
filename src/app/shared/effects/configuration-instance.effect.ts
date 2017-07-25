import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { configurationInstanceActions } from '../reducers/configuration-instance.reducer';

const IMPORT_ENDPOINT = '/configurations/instances';

@Injectable()
export class ConfigurationInstanceEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getConfigurationInstances(): Observable<Action> {
    return this.actions$
      .ofType(configurationInstanceActions.CONFIGURATION_INSTANCE_GET_REQUEST)
      .switchMap(action => this.api.get(`${IMPORT_ENDPOINT}/${action.payload}`)
        .map(res => ({type: configurationInstanceActions.CONFIGURATION_INSTANCE_GET, payload: res}))
        .catch((res) => Observable.of({type: configurationInstanceActions.CONFIGURATION_INSTANCE_GET_FAIL, payload: res}))
      );
  }
}
