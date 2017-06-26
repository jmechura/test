import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { merchantsActions } from '../reducers/merchant.reducer';

const MERCHANTS_ENDPOINT_LIST = '/merchants/list';

@Injectable()
export class MerchantsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getMerchants(): Observable<Action> {
    return this.actions$
      .ofType(merchantsActions.MERCHANTS_API_GET)
      .switchMap(action => this.api.post(MERCHANTS_ENDPOINT_LIST, action.payload)
        .map(res => ({type: merchantsActions.MERCHANTS_GET, payload: res}))
        .catch((res) => Observable.of({type: merchantsActions.MERCHANTS_GET_FAIL, payload: res}))
      );
  }
}
