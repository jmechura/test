import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { issuerCodeActions } from '../reducers/issuer-code.reducer';

const ISSUER_CODE_ENDPOINT = '/issuers/list/simple';

@Injectable()
export class IssuerCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getIssuerCodes(): Observable<Action> {
    return this.actions$
      .ofType(issuerCodeActions.ISSUER_CODE_GET_REQUEST)
      .switchMap(action => this.api.get(ISSUER_CODE_ENDPOINT)
        .map(res => ({type: issuerCodeActions.ISSUER_CODE_GET, payload: res}))
        .catch(() => Observable.of({type: issuerCodeActions.ISSUER_CODE_GET_FAIL}))
      );
  }
}
