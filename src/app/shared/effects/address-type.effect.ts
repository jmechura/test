import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { addressTypeActions } from '../reducers/address-type.reducer';

const ACQUIRER_ENDPOINT_LIST = '/adresses/types';

@Injectable()
export class AddressTypeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getAddressType(): Observable<Action> {
    return this.actions$
      .ofType(addressTypeActions.ADDRESS_TYPE_GET_REQUEST)
      .switchMap(action => this.api
        .get(`${ACQUIRER_ENDPOINT_LIST}`)
        .map(res => ({type: addressTypeActions.ADDRESS_TYPE_GET, payload: res}))
        .catch((res) => Observable.of({type: addressTypeActions.ADDRESS_TYPE_GET_FAIL, payload: res}))
      );
  }
}
