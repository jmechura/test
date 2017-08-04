import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { merchantDetailActions } from 'app/shared/reducers/merchant-detail.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const MERCHANT_DETAIL_ENDPOINT = '/merchants';

@Injectable()
export class MerchantsDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect()
  getMerchants(): Observable<Action> {
    return this.actions$
      .ofType(merchantDetailActions.MERCHANT_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${MERCHANT_DETAIL_ENDPOINT}/${action.payload}`)
        .map(res => ({type: merchantDetailActions.MERCHANT_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: merchantDetailActions.MERCHANT_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  createMerchant(): Observable<Action> {
    return this.actions$
      .ofType(merchantDetailActions.MERCHANT_DETAIL_POST_REQUEST)
      .switchMap(action => this.api.post(MERCHANT_DETAIL_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.createMerchant');
          return {type: merchantDetailActions.MERCHANT_DETAIL_POST, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: merchantDetailActions.MERCHANT_DETAIL_POST_FAIL, payload: res});
        })
      );
  }
}
