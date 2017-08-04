import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { orgUnitActions } from '../reducers/org-unit.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const ORG_UNIT_ENDPOINT = '/orgUnits';

@Injectable()
export class OrgUnitEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {}

  @Effect() getOrgUnit(): Observable<Action> {
    return this.actions$
      .ofType(orgUnitActions.ORG_UNIT_GET_REQUEST)
      .switchMap(action => this.api.get(`${ORG_UNIT_ENDPOINT}/${action.payload}`)
        .map(res => ({type: orgUnitActions.ORG_UNIT_GET, payload: res}))
        .catch(res => Observable.of({type: orgUnitActions.ORG_UNIT_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  updateOrgUnit(): Observable<Action> {
    return this.actions$
      .ofType(orgUnitActions.ORG_UNIT_PUT_REQUEST)
      .switchMap(action => this.api.put(ORG_UNIT_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.putOrgUnit');
          return {type: orgUnitActions.ORG_UNIT_PUT, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: orgUnitActions.ORG_UNIT_PUT_FAIL, payload: res});
        })
      );
  }
}
