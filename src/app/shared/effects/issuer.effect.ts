import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { issuersActions } from '../reducers/issuer.reducer';

const ISSUERS_ENDPOINT_LIST = '/issuers/list';

@Injectable()
export class IssuersEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getIssuers(): Observable<Action> {
    return this.actions$
      .ofType(issuersActions.ISSUERS_API_GET)
      .switchMap(action => this.api.post(ISSUERS_ENDPOINT_LIST, action.payload)
        .map(res => ({type: issuersActions.ISSUERS_GET, payload: res}))
        .catch((res) => Observable.of({type: issuersActions.ISSUERS_GET_FAIL, payload: res}))
      );
  }
}
