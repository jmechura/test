import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { reportPropertyDefActions } from '../reducers/report-property-def.reducer';

const PROPERTY_DEF_ENDPOINT = '/reports/properties/def';

@Injectable()
export class ReportPropertyDefEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getReportPropertyDefs(): Observable<Action> {
    return this.actions$
      .ofType(reportPropertyDefActions.REPORT_PROPERTY_DEF_GET_REQUEST)
      .switchMap(action => this.api.get(`${PROPERTY_DEF_ENDPOINT}/${action.payload}`)
        .map(res => ({type: reportPropertyDefActions.REPORT_PROPERTY_DEF_GET, payload: res}))
        .catch((res) => Observable.of({type: reportPropertyDefActions.REPORT_PROPERTY_DEF_GET_FAIL, payload: res}))
      );
  }
}
