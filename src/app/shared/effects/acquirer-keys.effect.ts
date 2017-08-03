import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { acquirerKeysActions } from '../reducers/acquirer-key.reducer';
import { LanguageService } from '../services/language.service';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const ACQUIRER_KEYS_ENDPOINT = '/networks/keys';

@Injectable()
export class AcquirerKeysEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService,
              private language: LanguageService) {
  }

  @Effect()
  getAcquirerKeys(): Observable<Action> {
    return this.actions$
      .ofType(acquirerKeysActions.ACQUIRER_KEYS_GET_REQUEST)
      .switchMap(action => this.api.get(`${ACQUIRER_KEYS_ENDPOINT}/list/${action.payload}`)
        .map(res => ({type: acquirerKeysActions.ACQUIRER_KEYS_GET, payload: res}))
        .catch((res) => Observable.of({type: acquirerKeysActions.ACQUIRER_KEYS_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  addAcquirerKey(): Observable<Action> {
    return this.actions$
      .ofType(acquirerKeysActions.ACQUIRER_KEYS_POST_REQUEST)
      .switchMap(action => this.api.post(ACQUIRER_KEYS_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.addAcquirerKey'));
          return {type: acquirerKeysActions.ACQUIRER_KEYS_POST, payload: res};
        })
        .catch((res) => {
          this.toastr.error(this.language.translate('toastr.error.addAcquirerKey'));
          return Observable.of({type: acquirerKeysActions.ACQUIRER_KEYS_POST_FAIL, payload: res});
        })
      );
  }

  @Effect()
  setKeyAsLast(): Observable<Action> {
    return this.actions$
      .ofType(acquirerKeysActions.ACQUIRER_KEYS_SET_LAST_POST_REQUEST)
      .switchMap(action => this.api.post(`${ACQUIRER_KEYS_ENDPOINT}/last/${action.payload}`, {})
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.setKeyAsLast'));
          return {type: acquirerKeysActions.ACQUIRER_KEYS_SET_LAST_POST, payload: res};
        })
        .catch((res) => {
          this.toastr.error(this.language.translate('toastr.error.setKeyAsLast'));
          return Observable.of({type: acquirerKeysActions.ACQUIRER_KEYS_SET_LAST_POST_FAIL, payload: res});
        })
      );
  }
}
