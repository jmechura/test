import { StateModel } from '../models/state.model';
import { Pagination } from '../models/pagination.model';
import { Action } from '@ngrx/store';
import { AcquirerModel } from '../models/acquirer.model';

export const acquirerActions = {
  ACQUIRERS_GET_REQUEST: 'ACQUIRERS_GET_REQUEST',
  ACQUIRERS_GET: 'ACQUIRERS_GET',
  ACQUIRERS_GET_FAIL: 'ACQUIRERS_GET_FAIL',
};

export type AcquirerState = StateModel<Pagination<AcquirerModel>>;

const INITIAL_STATE: AcquirerState = {error: null, loading: false};

export function acquirersReducer(state: AcquirerState = INITIAL_STATE,
                                 action: Action): AcquirerState {
  switch (action.type) {
    case acquirerActions.ACQUIRERS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case acquirerActions.ACQUIRERS_GET:
      return {data: action.payload, error: null, loading: false};

    case acquirerActions.ACQUIRERS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
