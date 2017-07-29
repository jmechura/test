import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { paymentTopupsDetailActions } from '../reducers/payment-topups-detail.reducer';

const TOPUPS_DETAIL_ENDPOINT_LIST = '/payments/topups';

@Injectable()
export class PaymentTopupsDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getPaymentTopupsDetail(): Observable<Action> {
    return this.actions$
      .ofType(paymentTopupsDetailActions.TOPUPS_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${TOPUPS_DETAIL_ENDPOINT_LIST}/${action.payload}`)
        .map(res => ({type: paymentTopupsDetailActions.TOPUPS_DETAIL_GET, payload: res}))
        .catch(res => Observable.of({type: paymentTopupsDetailActions.TOPUPS_DETAIL_GET_FAIL, payload: res}))
      );
  }
}
