import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { topupsScheduleDetailActions } from '../reducers/topups-schedule-detail.reducer';

const TOPUPS_SCHEDULE_ENDPOINT_LIST = '/topups/schedules';

@Injectable()
export class TopupsScheduleDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getTopupScheduleDetail(): Observable<Action> {
    return this.actions$
      .ofType(topupsScheduleDetailActions.TOPUPS_SCHEDULE_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${TOPUPS_SCHEDULE_ENDPOINT_LIST}/${action.payload}`)
        .map(res => ({type: topupsScheduleDetailActions.TOPUPS_SCHEDULE_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: topupsScheduleDetailActions.TOPUPS_SCHEDULE_DETAIL_GET_FAIL, payload: res}))
      );
  }
}
