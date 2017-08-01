import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { TopupScheduleItemModel } from '../models/topup-schedule-item.model';

export const topupsScheduleItemActions = {
  TOPUPS_SCHEDULE_ITEM_GET_REQUEST: 'TOPUPS_SCHEDULE_ITEM_GET_REQUEST',
  TOPUPS_SCHEDULE_ITEM_GET: 'TOPUPS_SCHEDULE_ITEM_GET',
  TOPUPS_SCHEDULE_ITEM_GET_FAIL: 'TOPUPS_SCHEDULE_ITEM_GET_FAIL',
};

export type TopupScheduleItemState = StateModel<Pagination<TopupScheduleItemModel>>;
const INITIAL_STATE: TopupScheduleItemState = {error: null, loading: false};

export function topupsScheduleItemReducer(state: TopupScheduleItemState = INITIAL_STATE,
                                          action: Action): TopupScheduleItemState {
  switch (action.type) {
    case topupsScheduleItemActions.TOPUPS_SCHEDULE_ITEM_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case topupsScheduleItemActions.TOPUPS_SCHEDULE_ITEM_GET:
      return {data: action.payload, error: null, loading: false};

    case topupsScheduleItemActions.TOPUPS_SCHEDULE_ITEM_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
