import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { configurationTypeActions } from '../reducers/configuration-type.reducer';

const IMPORT_ENDPOINT = '/configurations/types';

@Injectable()
export class ConfigurationTypeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getConfigurationTypes(): Observable<Action> {
    return this.actions$
      .ofType(configurationTypeActions.CONFIGURATION_TYPE_GET_REQUEST)
      .switchMap(action => this.api.get(IMPORT_ENDPOINT)
        .map(res => ({type: configurationTypeActions.CONFIGURATION_TYPE_GET, payload: res}))
        .catch((res) => Observable.of({type: configurationTypeActions.CONFIGURATION_TYPE_GET_FAIL, payload: res}))
      );
  }
}
