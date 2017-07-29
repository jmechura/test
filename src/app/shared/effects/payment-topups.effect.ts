import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { paymentTopupsActions } from '../reducers/payment-topups.reducer';

const TOPUPS_ENDPOINT_LIST = '/payments/topups/list';

@Injectable()
export class PaymentTopupsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getPaymentTopups(): Observable<Action> {
    return this.actions$
      .ofType(paymentTopupsActions.TOPUPS_GET_REQUEST)
      .switchMap(action => this.api.post(TOPUPS_ENDPOINT_LIST, action.payload)
        .map(res => ({type: paymentTopupsActions.TOPUPS_GET, payload: res}))
        .catch((res) => Observable.of({type: paymentTopupsActions.TOPUPS_GET_FAIL, payload: res}))
      );
  }
}
