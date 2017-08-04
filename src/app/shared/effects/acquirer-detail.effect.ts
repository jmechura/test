import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { acquirerDetailActions } from '../reducers/acquirer-detail.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const ACQUIRER_ENDPOINT_LIST = '/networks';

@Injectable()
export class AcquirerDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect()
  getAcquirerDetail(): Observable<Action> {
    return this.actions$
      .ofType(acquirerDetailActions.ACQUIRER_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${ACQUIRER_ENDPOINT_LIST}/${action.payload}`)
        .map(res => ({type: acquirerDetailActions.ACQUIRER_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: acquirerDetailActions.ACQUIRER_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  updateAcquirerDetail(): Observable<Action> {
    return this.actions$
      .ofType(acquirerDetailActions.ACQUIRER_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(ACQUIRER_ENDPOINT_LIST, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updateAcquirer');
          return {type: acquirerDetailActions.ACQUIRER_DETAIL_PUT, payload: res};
        })
        .catch((res) => {
          this.toastr.error(res);
          return Observable.of({type: acquirerDetailActions.ACQUIRER_DETAIL_PUT_FAIL, payload: res});
        })
      );
  }
}
