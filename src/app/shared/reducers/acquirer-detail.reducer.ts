import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { AcquirerModel } from '../models/acquirer.model';

export const acquirerDetailActions = {
  ACQUIRER_DETAIL_GET_REQUEST: 'ACQUIRER_DETAIL_GET_REQUEST',
  ACQUIRER_DETAIL_GET: 'ACQUIRER_DETAIL_GET',
  ACQUIRER_DETAIL_GET_FAIL: 'ACQUIRER_DETAIL_GET_FAIL',
  ACQUIRER_DETAIL_PUT_REQUEST: 'ACQUIRER_DETAIL_PUT_REQUEST',
  ACQUIRER_DETAIL_PUT: 'ACQUIRER_DETAIL_PUT',
  ACQUIRER_DETAIL_PUT_FAIL: 'ACQUIRER_DETAIL_PUT_FAIL',
};

const INITIAL_STATE: StateModel<AcquirerModel> = {error: null, loading: false};

export function acquirerDetailReducer(state: StateModel<AcquirerModel> = INITIAL_STATE,
                                      action: Action): StateModel<AcquirerModel> {
  switch (action.type) {
    case acquirerDetailActions.ACQUIRER_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case acquirerDetailActions.ACQUIRER_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case acquirerDetailActions.ACQUIRER_DETAIL_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    case acquirerDetailActions.ACQUIRER_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case acquirerDetailActions.ACQUIRER_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case acquirerDetailActions.ACQUIRER_DETAIL_PUT_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
