import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { addressDetailActions } from '../reducers/address-detail.reducer';

const ACQUIRER_ENDPOINT_LIST = '/adresses';

@Injectable()
export class AddressDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getAddressDetail(): Observable<Action> {
    return this.actions$
      .ofType(addressDetailActions.ADDRESS_DETAIL_GET_REQUEST)
      .switchMap(action => this.api
        .get(`${ACQUIRER_ENDPOINT_LIST}/${action.payload.resource}/${action.payload.resourceId}/${action.payload.type}`)
        .map(res => ({type: addressDetailActions.ADDRESS_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: addressDetailActions.ADDRESS_DETAIL_GET_FAIL, payload: res}))
      );
  }
}
