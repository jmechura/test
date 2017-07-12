import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { SystemModel } from '../models/system.model';

export const systemsActions = {
  SYSTEMS_GET_REQUEST: 'SYSTEMS_GET_REQUEST',
  SYSTEMS_GET: 'SYSTEMS_GET',
  SYSTEMS_GET_FAIL: 'SYSTEMS_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<SystemModel>> = {error: null, loading: false};

export function systemReducer(state: StateModel<Pagination<SystemModel>> = INITIAL_STATE,
                              action: Action): StateModel<Pagination<SystemModel>> {
  switch (action.type) {
    case systemsActions.SYSTEMS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case systemsActions.SYSTEMS_GET:
      return {data: action.payload, error: null, loading: false};

    case systemsActions.SYSTEMS_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
