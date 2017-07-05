import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { OrgUnitModel } from 'app/shared/models/org-unit.model';
import { Pagination } from '../models/pagination.model';

export const orgUnitListActions = {
  ORG_UNIT_LIST_GET_REQUEST: 'ORG_UNIT_LIST_GET_REQUEST',
  ORG_UNIT_LIST_GET_ERROR: 'ORG_UNIT_LIST_GET_ERROR',
  ORG_UNIT_LIST_GET: 'ORG_UNIT_LIST_GET',
};

export type OrgUnitListState = StateModel<Pagination<OrgUnitModel>>;

const INITIAL_STATE: OrgUnitListState = {error: null, loading: false};

export function orgUnitListReducer(state: OrgUnitListState = INITIAL_STATE, action: Action): OrgUnitListState {
  switch (action.type) {
    case orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case orgUnitListActions.ORG_UNIT_LIST_GET_ERROR:
      return {error: action.payload, loading: false};

    case orgUnitListActions.ORG_UNIT_LIST_GET:
      return {data: action.payload, error: null, loading: false};

    default:
      return state;
  }
}
