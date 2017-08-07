import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { issuerDetailActions } from '../reducers/issuer-detail.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const ISSUER_DETAIL_ENDPOINT_LIST = '/issuers';

@Injectable()
export class IssuerDetailEffect {
  constructor(private api: ApiService,
              private toastr: ExtendedToastrService,
              private actions$: Actions) {
  }

  @Effect()
  getIssuerDetail(): Observable<Action> {
    return this.actions$
      .ofType(issuerDetailActions.ISSUER_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${ISSUER_DETAIL_ENDPOINT_LIST}/${action.payload}`)
        .map(res => ({type: issuerDetailActions.ISSUER_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: issuerDetailActions.ISSUER_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  putIssuerDetail(): Observable<Action> {
    return this.actions$
      .ofType(issuerDetailActions.ISSUER_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(ISSUER_DETAIL_ENDPOINT_LIST, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updateIssuer');
          return {type: issuerDetailActions.ISSUER_DETAIL_PUT, payload: res};
        })
        .catch((res) => {
          this.toastr.error(res);
          return Observable.of({type: issuerDetailActions.ISSUER_DETAIL_PUT_FAIL, payload: res});
        })
      );
  }
}
