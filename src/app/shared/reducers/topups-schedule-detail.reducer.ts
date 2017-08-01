import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { TopupsScheduleModel } from '../models/topups-schedule.model';

export const topupsScheduleDetailActions = {
  TOPUPS_SCHEDULE_DETAIL_GET_REQUEST: 'TOPUPS_SCHEDULE_DETAIL_GET_REQUEST',
  TOPUPS_SCHEDULE_DETAIL_GET: 'TOPUPS_SCHEDULE_DETAIL_GET',
  TOPUPS_SCHEDULE_DETAIL_GET_FAIL: 'TOPUPS_SCHEDULE_DETAIL_GET_FAIL',
};


const INITIAL_STATE: StateModel<TopupsScheduleModel> = {error: null, loading: false};

export function topupsScheduleDetailReducer(state: StateModel<TopupsScheduleModel> = INITIAL_STATE,
                                            action: Action): StateModel<TopupsScheduleModel> {
  switch (action.type) {
    case topupsScheduleDetailActions.TOPUPS_SCHEDULE_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case topupsScheduleDetailActions.TOPUPS_SCHEDULE_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case topupsScheduleDetailActions.TOPUPS_SCHEDULE_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
