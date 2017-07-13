import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { PropertyDefModel } from '../models/property-def.model.';

export const importPropertyDefActions = {
  IMPORT_PROPERTY_DEF_GET_REQUEST: 'IMPORT_PROPERTY_DEF_GET_REQUEST',
  IMPORT_PROPERTY_DEF_GET: 'IMPORT_PROPERTY_DEF_GET',
  IMPORT_PROPERTY_DEF_GET_FAIL: 'IMPORT_PROPERTY_DEF_GET_FAIL'
};

const INITIAL_STATE: StateModel<PropertyDefModel[]> = {error: null, loading: false};

export function importPropertyDefReducer(state: StateModel<PropertyDefModel[]> = INITIAL_STATE,
                                         action: Action): StateModel<PropertyDefModel[]> {
  switch (action.type) {
    case importPropertyDefActions.IMPORT_PROPERTY_DEF_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case importPropertyDefActions.IMPORT_PROPERTY_DEF_GET:
      return {data: action.payload, error: null, loading: false};

    case importPropertyDefActions.IMPORT_PROPERTY_DEF_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
