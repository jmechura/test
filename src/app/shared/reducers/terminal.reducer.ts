import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { TerminalModel } from '../models/terminal.model';
import { Pagination } from '../models/pagination.model';

export const terminalActions = {
  TERMINAL_GET_REQUEST: 'TERMINAL_GET_REQUEST',
  TERMINAL_GET: 'TERMINAL_GET',
  TERMINAL_GET_FAIL: 'TERMINAL_GET_FAIL',
  TERMINAL_POST_REQUEST: 'TERMINAL_POST_REQUEST',
  TERMINAL_POST: 'TERMINAL_POST',
  TERMINAL_POST_FAIL: 'TERMINAL_POST_FAIL',
  TERMINAL_PUT_REQUEST: 'TERMINAL_PUT_REQUEST',
  TERMINAL_PUT: 'TERMINAL_PUT',
  TERMINAL_PUT_FAIL: 'TERMINAL_PUT_FAIL',
  TERMINAL_DELETE_REQUEST: 'TERMINAL_DELETE_REQUEST',
  TERMINAL_DELETE: 'TERMINAL_DELETE',
  TERMINAL_DELETE_FAIL: 'TERMINAL_DELETE_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<TerminalModel>> = {error: null, loading: false};

export function terminalReducer(state: StateModel<Pagination<TerminalModel>> = INITIAL_STATE,
                                action: Action): StateModel<Pagination<TerminalModel>> {
  switch (action.type) {
    case terminalActions.TERMINAL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case terminalActions.TERMINAL_GET:
      return {data: action.payload, error: null, loading: false};

    case terminalActions.TERMINAL_GET_FAIL:
      return {error: action.payload, loading: false};

    case terminalActions.TERMINAL_POST_REQUEST:
      return {data: state.data, error: null, loading: true};

    case terminalActions.TERMINAL_POST:
      return {data: state.data, error: null, loading: false};

    case terminalActions.TERMINAL_POST_FAIL:
      return {error: action.payload, loading: false};

    case terminalActions.TERMINAL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case terminalActions.TERMINAL_PUT:
      return {data: updateTable(state.data, action.payload), error: null, loading: false};

    case terminalActions.TERMINAL_PUT_FAIL:
      return {error: action.payload, loading: false};

    case terminalActions.TERMINAL_DELETE_REQUEST:
      return {data: state.data, error: null, loading: true};

    case terminalActions.TERMINAL_DELETE:
      return {data: state.data, error: null, loading: false};

    case terminalActions.TERMINAL_DELETE_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}

function updateTable(state: Pagination<TerminalModel>, payload: TerminalModel): Pagination<TerminalModel> {
  state.content[state.content.findIndex(item => item.id === payload.id)] = payload;
  return state;
}
