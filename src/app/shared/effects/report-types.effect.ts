import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { reportTypeActions } from '../reducers/report-types.reducer';

const REPORT_TYPE_ENDPOINT = '/reports/types';

@Injectable()
export class ReportTypesEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getReportTypes(): Observable<Action> {
    return this.actions$
      .ofType(reportTypeActions.REPORT_TYPE_GET_REQUEST)
      .switchMap(action => this.api.get(REPORT_TYPE_ENDPOINT)
        .map(res => ({type: reportTypeActions.REPORT_TYPE_GET, payload: res}))
        .catch(res => Observable.of({type: reportTypeActions.REPORT_TYPE_GET_FAIL, payload: res}))
      );
  }
}
