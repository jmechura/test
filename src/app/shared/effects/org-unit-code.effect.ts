import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { orgUnitCodeActions } from '../reducers/org-unit-code.reducer';

const ORG_UNIT_CODES_ENDPOINT = '/orgUnits/list/simple';

@Injectable()
export class OrgUnitCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getOrgUnitCodes(): Observable<Action> {
    return this.actions$
      .ofType(orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST)
      .switchMap(action => this.api.get(`${ORG_UNIT_CODES_ENDPOINT}/${action.payload}`)
        .map(res => ({type: orgUnitCodeActions.ORG_UNIT_CODE_GET, payload: res}))
        .catch((res) => Observable.of({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_FAIL, payload: res}))
      );
  }
}
