import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionTransferActions } from '../reducers/transactionTransfer.reducer';

@Injectable()
export class TransactionTransferEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTransfers(): Observable<Action> {
    return this.actions$
      .ofType(transactionTransferActions.TRANSACTION_TRANSFERS_GET_REQUEST)
      .switchMap(action => this.api.get(`/trxs/${action.payload.uuid}/${action.payload.termDttm}/transfers`)
        .map(res => ({type: transactionTransferActions.TRANSACTION_TRANSFERS_GET, payload: res}))
        .catch((res) => Observable.of({type: transactionTransferActions.TRANSACTION_TRANSFERS_GET_FAIL, payload: res}))
      );
  }
}
