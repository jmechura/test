import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { orgUnitListActions } from '../reducers/org-unit-list.reducer';

const ORG_UNIT_LIST_ENDPOINT = '/orgUnits/list';

@Injectable()
export class OrgUnitListEffect {
  constructor(private api: ApiService, private actions$: Actions) {}

  @Effect() get(): Observable<Action> {
    return this.actions$
      .ofType(orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST)
      .switchMap(action => this.api.post(ORG_UNIT_LIST_ENDPOINT, action.payload)
        .map(res => ({type: orgUnitListActions.ORG_UNIT_LIST_GET, payload: res}))
        .catch(res => Observable.of({type: orgUnitListActions.ORG_UNIT_LIST_GET_ERROR, payload: res}))
      );
  }
}
