import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { singleTransactionActions } from '../reducers/transaction.reducer';

@Injectable()
export class TransactionEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTransaction(): Observable<Action> {
    return this.actions$
      .ofType(singleTransactionActions.TRANSACTION_GET_REQUEST)
      .switchMap(action => this.api.get(`/trxs/${action.payload.uuid}/${action.payload.termDttm}`)
        .map(res => ({type: singleTransactionActions.TRANSACTION_GET, payload: res}))
        .catch((res) => Observable.of({type: singleTransactionActions.TRANSACTION_GET_FAIL, payload: res}))
      );
  }
}
