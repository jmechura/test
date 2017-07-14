import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { reportPropertyActions } from '../reducers/report-property.reducer';

const PROPERTY_ENDPOINT = '/reports/properties';

@Injectable()
export class ReportPropertyEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getReportProperties(): Observable<Action> {
    return this.actions$
      .ofType(reportPropertyActions.REPORT_PROPERTY_GET_REQUEST)
      .switchMap(action => this.api.get(`${PROPERTY_ENDPOINT}/${action.payload}`)
        .map(res => ({type: reportPropertyActions.REPORT_PROPERTY_GET, payload: res}))
        .catch((res) => Observable.of({type: reportPropertyActions.REPORT_PROPERTY_GET_FAIL, payload: res}))
      );
  }
}
