import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { OrgUnitCodeModel } from '../models/org-unit-code.model';

export const orgUnitCodeActions = {
  ORG_UNIT_CODE_GET_REQUEST: 'ORG_UNIT_CODE_GET_REQUEST',
  ORG_UNIT_CODE_GET: 'ORG_UNIT_CODE_GET',
  ORG_UNIT_CODE_GET_FAIL: 'ORG_UNIT_CODE_GET_FAIL'
};

const INITIAL_STATE: StateModel<OrgUnitCodeModel[]> = {error: null, loading: false};

export function orgUnitCodeReducer(state: StateModel<OrgUnitCodeModel[]> = INITIAL_STATE,
                                   action: Action): StateModel<OrgUnitCodeModel[]> {
  switch (action.type) {
    case orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case orgUnitCodeActions.ORG_UNIT_CODE_GET:
      return {data: action.payload, error: null, loading: false};

    case orgUnitCodeActions.ORG_UNIT_CODE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
