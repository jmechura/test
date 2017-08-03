import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { reportDetailActions } from '../reducers/report-detail.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';
import { LanguageService } from '../services/language.service';

const REPORT_ENDPOINT = '/reports/data';
const REPORT_UPDATE_ENDPOINT = '/reports';

@Injectable()
export class ReportDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private language: LanguageService,
              private toastr: ExtendedToastrService) {
  }

  @Effect()
  getReportDetail(): Observable<Action> {
    return this.actions$
      .ofType(reportDetailActions.REPORTS_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${REPORT_ENDPOINT}/${action.payload}`)
        .map(res => ({type: reportDetailActions.REPORTS_DETAIL_GET, payload: res}))
        .catch(res => Observable.of({type: reportDetailActions.REPORTS_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  updateReportDetail(): Observable<Action> {
    return this.actions$
      .ofType(reportDetailActions.REPORT_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(`${REPORT_UPDATE_ENDPOINT}`, action.payload)
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.updateReportDetail'));
          return {type: reportDetailActions.REPORT_DETAIL_PUT, payload: res};
        })
        .catch(res => {
          this.toastr.error(this.language.translate('toastr.error.updateReportDetail'));
          return Observable.of({type: reportDetailActions.REPORT_DETAIL_PUT_FAIL, payload: res});
        })
      );
  }
}
