import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';

export const ruleActions = {
  RULE_API_GET: 'RULE_API_GET',
  RULE_GET: 'RULE_GET',
  RULE_GET_FAIL: 'RULE_GET_FAIL',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function ruleReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case ruleActions.RULE_API_GET:
      return {data: state.data, error: null, loading: true};

    case ruleActions.RULE_GET:
      return {data: action.payload, error: null, loading: false};

    case ruleActions.RULE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
