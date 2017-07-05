import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { orgUnitActions } from '../reducers/org-unit.reducer';

const ORG_UNIT_ENDPOINT = '/orgUnits';

@Injectable()
export class OrgUnitEffect {
  constructor(private api: ApiService, private actions$: Actions) {}

  @Effect() get(): Observable<Action> {
    return this.actions$
      .ofType(orgUnitActions.ORG_UNIT_GET_REQUEST)
      .switchMap(action => this.api.get(`${ORG_UNIT_ENDPOINT}/${action.payload}`)
        .map(res => ({type: orgUnitActions.ORG_UNIT_GET, payload: res}))
        .catch(res => Observable.of({type: orgUnitActions.ORG_UNIT_GET_ERROR, payload: res}))
      );
  }
}
