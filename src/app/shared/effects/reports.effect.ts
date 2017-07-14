import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { reportActions } from '../reducers/reports.reducer';

const REPORTS_ENDPOINT = '/reports/data/list';

@Injectable()
export class ReportsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() get(): Observable<Action> {
    return this.actions$
      .ofType(reportActions.REPORTS_GET_REQUEST)
      .switchMap(action => this.api.post(REPORTS_ENDPOINT, action.payload)
        .map(res => ({type: reportActions.REPORTS_GET, payload: res}))
        .catch(res => Observable.of({type: reportActions.REPORTS_GET_FAIL, payload: res}))
      );
  }
}
