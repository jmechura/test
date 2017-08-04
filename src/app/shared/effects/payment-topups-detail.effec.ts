import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { paymentTopupsDetailActions } from '../reducers/payment-topups-detail.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const TOPUPS_DETAIL_ENDPOINT = '/payments/topups';

@Injectable()
export class PaymentTopupsDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect()
  getPaymentTopupsDetail(): Observable<Action> {
    return this.actions$
      .ofType(paymentTopupsDetailActions.TOPUPS_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${TOPUPS_DETAIL_ENDPOINT}/${action.payload}`)
        .map(res => ({type: paymentTopupsDetailActions.TOPUPS_DETAIL_GET, payload: res}))
        .catch(res => Observable.of({type: paymentTopupsDetailActions.TOPUPS_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  updatePaymentTopupsDetail(): Observable<Action> {
    return this.actions$
      .ofType(paymentTopupsDetailActions.TOPUPS_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(TOPUPS_DETAIL_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updatePaymentTopup');
          return {type: paymentTopupsDetailActions.TOPUPS_DETAIL_PUT, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: paymentTopupsDetailActions.TOPUPS_DETAIL_PUT_FAIL, payload: res});
        })
      );
  }
}
