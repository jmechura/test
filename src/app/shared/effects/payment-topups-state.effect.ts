import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { paymentTopupsStateActions } from '../reducers/payment-topups-state.reducer';

const TOPUPS_STATE_ENDPOINT = '/payments/topups/states';

@Injectable()
export class PaymentTopupsStateEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getPaymentTopupsStates(): Observable<Action> {
    return this.actions$
      .ofType(paymentTopupsStateActions.TOPUPS_STATE_GET_REQUEST)
      .switchMap(action => this.api.get(TOPUPS_STATE_ENDPOINT)
        .map(res => ({type: paymentTopupsStateActions.TOPUPS_STATE_GET, payload: res}))
        .catch((res) => Observable.of({type: paymentTopupsStateActions.TOPUPS_STATE_GET_FAIL, payload: res}))
      );
  }
}
