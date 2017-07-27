import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transfersActions } from '../reducers/transfers.reducer';

const TRANSFERS_ENDPOINT_LIST = '/accounts/transfers';

@Injectable()
export class TransferEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTransfers(): Observable<Action> {
    return this.actions$
      .ofType(transfersActions.TRANSFERS_GET_REQUEST)
      .switchMap(action =>
        this.api.post(`${TRANSFERS_ENDPOINT_LIST}/${action.payload.type}/${action.payload.uuid}`, action.payload.predicatedObject)
        .map(res => ({type: transfersActions.TRANSFERS_GET, payload: res}))
        .catch((res) => Observable.of({type: transfersActions.TRANSFERS_GET_FAIL, payload: res}))
      );
  }
}
