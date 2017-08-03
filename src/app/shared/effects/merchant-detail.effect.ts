import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { merchantDetailActions } from 'app/shared/reducers/merchant-detail.reducer';
import { LanguageService } from '../services/language.service';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const MERCHANT_DETAIL_ENDPOINT = '/merchants';

@Injectable()
export class MerchantsDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private language: LanguageService,
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
  // TODO ? IS IT ADD MERCHANT?
  @Effect()
  postMerchant(): Observable<Action> {
    return this.actions$
      .ofType(merchantDetailActions.MERCHANT_DETAIL_POST_REQUEST)
      .switchMap(action => this.api.post(MERCHANT_DETAIL_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.postMerchant'));
          return {type: merchantDetailActions.MERCHANT_DETAIL_POST, payload: res};
        })
        .catch(res => {
          this.toastr.error(this.language.translate('toastr.error.postMerchant'));
          return Observable.of({type: merchantDetailActions.MERCHANT_DETAIL_POST_FAIL, payload: res});
        })
      );
  }
}
