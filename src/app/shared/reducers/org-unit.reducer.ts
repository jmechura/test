import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { OrgUnitModel } from 'app/shared/models/org-unit.model';

export const orgUnitActions = {
  ORG_UNIT_GET_REQUEST: 'ORG_UNIT_GET_REQUEST',
  ORG_UNIT_GET_FAIL: 'ORG_UNIT_GET_FAIL',
  ORG_UNIT_GET: 'ORG_UNIT_GET',
  ORG_UNIT_PUT_REQUEST: 'ORG_UNIT_PUT_REQUEST',
  ORG_UNIT_PUT_FAIL: 'ORG_UNIT_PUT_FAIL',
  ORG_UNIT_PUT: 'ORG_UNIT_GET',
  CLEAR: 'CLEAR',
};

export type OrgUnitState = StateModel<OrgUnitModel>;

const INITIAL_STATE: OrgUnitState = {error: null, loading: false};

export function orgUnitReducer(state: OrgUnitState = INITIAL_STATE, action: Action): OrgUnitState {
  switch (action.type) {
    case orgUnitActions.ORG_UNIT_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case orgUnitActions.ORG_UNIT_GET_FAIL:
      return {error: action.payload, loading: false};

    case orgUnitActions.ORG_UNIT_GET:
      return {data: action.payload, error: null, loading: false};

    case orgUnitActions.ORG_UNIT_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case orgUnitActions.ORG_UNIT_PUT_FAIL:
      return {error: action.payload, loading: false};

    case orgUnitActions.ORG_UNIT_PUT:
      return {data: action.payload, error: null, loading: false};

    case orgUnitActions.CLEAR:
      return INITIAL_STATE;

    default:
      return state;
  }
}
