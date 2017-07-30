import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { topupsScheduleActions } from '../reducers/topups-schedule.reducer';

const TOPUPS_SCHEDULE_ENDPOINT_LIST = '/topups/schedules/list';

@Injectable()
export class TopupsScheduleEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getPaymentsSchedule(): Observable<Action> {
    return this.actions$
      .ofType(topupsScheduleActions.TOPUPS_SCHEDULE_API_GET)
      .switchMap(action => this.api.post(TOPUPS_SCHEDULE_ENDPOINT_LIST, action.payload)
        .map(res => ({type: topupsScheduleActions.TOPUPS_SCHEDULE_GET, payload: res}))
        .catch((res) => Observable.of({type: topupsScheduleActions.TOPUPS_SCHEDULE_GET_FAIL, payload: res}))
      );
  }
}
