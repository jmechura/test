import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const configurationTypeActions = {
  CONFIGURATION_TYPE_GET_REQUEST: 'CONFIGURATION_TYPE_GET_REQUEST',
  CONFIGURATION_TYPE_GET: 'CONFIGURATION_TYPE_GET',
  CONFIGURATION_TYPE_GET_FAIL: 'CONFIGURATION_TYPE_GET_FAIL'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function configurationTypeReducer(state: StateModel<string[]> = INITIAL_STATE,
                                         action: Action): StateModel<string[]> {
  switch (action.type) {
    case configurationTypeActions.CONFIGURATION_TYPE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case configurationTypeActions.CONFIGURATION_TYPE_GET:
      return {data: action.payload, error: null, loading: false};

    case configurationTypeActions.CONFIGURATION_TYPE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
