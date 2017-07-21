import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { reportsActions } from '../reducers/reports.reducer';

const REPORTS_ENDPOINT = '/reports/list';

@Injectable()
export class ReportsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getReports(): Observable<Action> {
    return this.actions$
      .ofType(reportsActions.REPORTS_GET_REQUEST)
      .switchMap(action => this.api.post(REPORTS_ENDPOINT, action.payload)
        .map(res => ({type: reportsActions.REPORTS_GET, payload: res}))
        .catch(res => Observable.of({type: reportsActions.REPORTS_GET_FAIL, payload: res}))
      );
  }
}
