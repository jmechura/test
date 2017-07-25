import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const configurationInstanceActions = {
  CONFIGURATION_INSTANCE_GET_REQUEST: 'CONFIGURATION_INSTANCE_GET_REQUEST',
  CONFIGURATION_INSTANCE_GET: 'CONFIGURATION_INSTANCE_GET',
  CONFIGURATION_INSTANCE_GET_FAIL: 'CONFIGURATION_INSTANCE_GET_FAIL'
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function configurationInstanceReducer(state: StateModel<string[]> = INITIAL_STATE,
                                             action: Action): StateModel<string[]> {
  switch (action.type) {
    case configurationInstanceActions.CONFIGURATION_INSTANCE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case configurationInstanceActions.CONFIGURATION_INSTANCE_GET:
      return {data: action.payload, error: null, loading: false};

    case configurationInstanceActions.CONFIGURATION_INSTANCE_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
