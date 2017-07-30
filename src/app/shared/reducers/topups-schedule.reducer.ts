import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { TopupsScheduleModel } from '../models/topups-schedule.model';

export const topupsScheduleActions = {
  TOPUPS_SCHEDULE_API_GET: 'TOPUPS_SCHEDULE_API_GET',
  TOPUPS_SCHEDULE_GET: 'TOPUPS_SCHEDULE_GET',
  TOPUPS_SCHEDULE_GET_FAIL: 'TOPUPS_SCHEDULE_GET_FAIL',
};

export type TopupsScheduleState = StateModel<Pagination<TopupsScheduleModel>>;

const INITIAL_STATE: StateModel<Pagination<TopupsScheduleModel>> = {error: null, loading: false};

export function topupsScheduleReducer(state: TopupsScheduleState = INITIAL_STATE, action: Action): TopupsScheduleState {
  switch (action.type) {
    case topupsScheduleActions.TOPUPS_SCHEDULE_API_GET:
      return {data: state.data, error: null, loading: true};

    case topupsScheduleActions.TOPUPS_SCHEDULE_GET:
      return {data: action.payload, error: null, loading: false};

    case topupsScheduleActions.TOPUPS_SCHEDULE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
