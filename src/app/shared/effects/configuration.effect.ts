import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { configurationActions } from '../reducers/configuration.reducer';
import { LanguageService } from '../services/language.service';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const CONFIGURATIONS_ENDPOINT = '/configurations';

@Injectable()
export class ConfigurationEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService,
              private language: LanguageService) {
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
  // TODO ? IS NEEDED?
  @Effect()
  createConfiguration(): Observable<Action> {
    return this.actions$
      .ofType(configurationActions.CONFIGURATIONS_CREATE_REQUEST)
      .switchMap(action => this.api.post(CONFIGURATIONS_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.createConfiguration'));
          return {type: configurationActions.CONFIGURATIONS_CREATE, payload: res};
        })
        .catch(res => {
          this.toastr.error(this.language.translate('toastr.error.createConfiguration'));
          return Observable.of({type: configurationActions.CONFIGURATIONS_CREATE_FAIL, payload: res});
        })
      );
  }
  // TODO ? IS NEEDED?
  @Effect()
  deleteConfiguration(): Observable<Action> {
    return this.actions$
      .ofType(configurationActions.CONFIGURATIONS_DELETE_REQUEST)
      .switchMap(action => this.api.remove(`${CONFIGURATIONS_ENDPOINT}/${action.payload}`)
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.deleteConfiguration'));
          return {type: configurationActions.CONFIGURATIONS_DELETE, payload: res};
        })
        .catch(res => {
          this.toastr.error(this.language.translate('toastr.error.deleteConfiguration'));
          return Observable.of({type: configurationActions.CONFIGURATIONS_DELETE_FAIL, payload: res});
        })
      );
  }
}
