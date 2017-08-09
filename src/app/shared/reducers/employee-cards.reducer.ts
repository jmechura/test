import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Card } from '../models/card.model';

export const employeeCardsActions = {
  EMPLOYEE_CARDS_GET_REQUEST: 'EMPLOYEE_CARDS_GET_REQUEST',
  EMPLOYEE_CARDS_GET: 'EMPLOYEE_CARDS_GET',
  EMPLOYEE_CARDS_GET_FAIL: 'EMPLOYEE_CARDS_GET_FAIL',
};

export type EmployeeCardState = StateModel<Card[]>;
const INITIAL_STATE: EmployeeCardState = {error: null, loading: false};

export function employeeCardsReducer(state: EmployeeCardState = INITIAL_STATE, action: Action): EmployeeCardState {
  switch (action.type) {
    case employeeCardsActions.EMPLOYEE_CARDS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case employeeCardsActions.EMPLOYEE_CARDS_GET:
      return {data: action.payload, error: null, loading: false};

    case employeeCardsActions.EMPLOYEE_CARDS_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}

