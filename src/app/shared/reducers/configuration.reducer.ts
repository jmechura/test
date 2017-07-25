import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { ConfigurationModel } from '../models/configuration.model';

export const configurationActions = {
  CONFIGURATIONS_GET_REQUEST: 'CONFIGURATIONS_GET_REQUEST',
  CONFIGURATIONS_GET: 'CONFIGURATIONS_GET',
  CONFIGURATIONS_GET_FAIL: 'CONFIGURATIONS_GET_FAIL',
  CONFIGURATIONS_CREATE_REQUEST: 'CONFIGURATIONS_CREATE_REQUEST',
  CONFIGURATIONS_CREATE: 'CONFIGURATIONS_CREATE',
  CONFIGURATIONS_CREATE_FAIL: 'CONFIGURATIONS_CREATE_FAIL',
};

const INITIAL_STATE: StateModel<ConfigurationModel[]> = {error: null, loading: false};

export function configurationReducer(state: StateModel<ConfigurationModel[]> = INITIAL_STATE,
                                     action: Action): StateModel<ConfigurationModel[]> {
  switch (action.type) {
    case configurationActions.CONFIGURATIONS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case configurationActions.CONFIGURATIONS_GET:
      return {data: action.payload, error: null, loading: false};

    case configurationActions.CONFIGURATIONS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    case configurationActions.CONFIGURATIONS_CREATE_REQUEST:
      return {data: state.data, error: null, loading: true};

    case configurationActions.CONFIGURATIONS_CREATE:
      return {data: state.data, error: null, loading: false};

    case configurationActions.CONFIGURATIONS_CREATE_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
