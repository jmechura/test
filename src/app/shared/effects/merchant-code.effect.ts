import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { merchantCodeActions } from '../reducers/merchant-code.reducer';

const MERCHANT_CODE_ENDPOINT = '/merchants/list/simple';

@Injectable()
export class MerchantCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getMerchantCodes(): Observable<Action> {
    return this.actions$
      .ofType(merchantCodeActions.MERCHANT_CODE_GET_REQUEST)
      .switchMap(action => this.api.get(`${MERCHANT_CODE_ENDPOINT}/${action.payload}`)
        .map(res => ({type: merchantCodeActions.MERCHANT_CODE_GET, payload: res}))
        .catch((res) => Observable.of({type: merchantCodeActions.MERCHANT_CODE_GET_FAIL, payload: res}))
      );
  }
}
