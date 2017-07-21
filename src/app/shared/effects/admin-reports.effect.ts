import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { adminReportActions } from '../reducers/admin-reports.reducer';

const REPORTS_ENDPOINT = '/reports/data/list';

@Injectable()
export class AdminReportsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  get(): Observable<Action> {
    return this.actions$
      .ofType(adminReportActions.ADMIN_REPORTS_GET_REQUEST)
      .switchMap(action => this.api.post(REPORTS_ENDPOINT, action.payload)
        .map(res => ({type: adminReportActions.ADMIN_REPORTS_GET, payload: res}))
        .catch(res => Observable.of({type: adminReportActions.ADMIN_REPORTS_GET_FAIL, payload: res}))
      );
  }
}
