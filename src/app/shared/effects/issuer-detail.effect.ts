import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { issuerDetailActions } from '../reducers/issuer-detail.reducer';

const ISSUER_DETAIL_ENDPOINT_LIST = '/issuers';

@Injectable()
export class IssuerDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getIssuerDetail(): Observable<Action> {
    return this.actions$
      .ofType(issuerDetailActions.ISSUER_DETAIL_API_GET)
      .switchMap(action => this.api.get(`${ISSUER_DETAIL_ENDPOINT_LIST}/${action.payload}`)
        .map(res => ({type: issuerDetailActions.ISSUER_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: issuerDetailActions.ISSUER_DETAIL_GET_FAIL, payload: res}))
      );
  }
}
