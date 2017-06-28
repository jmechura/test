import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { networkCodeActions } from '../reducers/network-code.reducer';

const NETWORK_CODES_ENDPOINT = '/networks/list/simple';

@Injectable()
export class NetworkCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getNetworkCodes(): Observable<Action> {
    return this.actions$
      .ofType(networkCodeActions.NETWORK_CODE_GET_REQUEST)
      .switchMap(action => this.api.get(NETWORK_CODES_ENDPOINT)
        .map(res => ({type: networkCodeActions.NETWORK_CODE_GET, payload: res}))
        .catch((res) => Observable.of({type: networkCodeActions.NETWORK_CODE_GET_FAIL, payload: res}))
      );
  }
}
