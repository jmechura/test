import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { transactionEbankActions } from '../reducers/transaction-ebank.reducer';

@Injectable()
export class TransactionEbankEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getEbank(): Observable<Action> {
    return this.actions$
      .ofType(transactionEbankActions.TRANSACTION_EBANK_GET_REQUEST)
      .switchMap(action => this.api.get(`/trxs/${action.payload.uuid}/${action.payload.termDttm}/ebank`)
        .map(res => ({type: transactionEbankActions.TRANSACTION_EBANK_GET, payload: res}))
        .catch((res) => Observable.of({type: transactionEbankActions.TRANSACTION_EBANK_GET_FAIL, payload: res}))
      );
  }
}
