import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { topupsScheduleItemActions } from '../reducers/topup-schedule-item.reducer';

const TOPUPS_SCHEDULE_ITEM_ENDPOINT = '/topups/schedules/items/list';

@Injectable()
export class TopupsScheduleItemEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getTopupScheduleItem(): Observable<Action> {
    return this.actions$
      .ofType(topupsScheduleItemActions.TOPUPS_SCHEDULE_ITEM_GET_REQUEST)
      .switchMap(action => this.api.post(`${TOPUPS_SCHEDULE_ITEM_ENDPOINT}/${action.payload.name}`, action.payload.body)
        .map(res => ({type: topupsScheduleItemActions.TOPUPS_SCHEDULE_ITEM_GET, payload: res}))
        .catch((res) => Observable.of({type: topupsScheduleItemActions.TOPUPS_SCHEDULE_ITEM_GET_FAIL, payload: res}))
      );
  }
}
