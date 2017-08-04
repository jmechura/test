import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { acquirerKeysActions } from '../reducers/acquirer-key.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

export const ACQUIRER_KEYS_ENDPOINT = '/networks/keys';

@Injectable()
export class AcquirerKeysEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
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
}
