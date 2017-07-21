import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { TerminalModel } from '../models/terminal.model';

export const terminalDetailActions = {
  TERMINAL_DETAIL_GET_REQUEST: 'TERMINAL_DETAIL_GET_REQUEST',
  TERMINAL_DETAIL_GET: 'TERMINAL_DETAIL_GET',
  TERMINAL_DETAIL_GET_FAIL: 'TERMINAL_DETAIL_GET_FAIL',
  TERMINAL_DETAIL_POST_REQUEST: 'TERMINAL_DETAIL_POST_REQUEST',
  TERMINAL_DETAIL_POST: 'TERMINAL_DETAIL_POST',
  TERMINAL_DETAIL_POST_FAIL: 'TERMINAL_DETAIL_POST_FAIL',
};

const INITIAL_STATE: StateModel<TerminalModel> = {error: null, loading: false};

export function terminalDetailReducer(state: StateModel<TerminalModel> = INITIAL_STATE,
                                      action: Action): StateModel<TerminalModel> {
  switch (action.type) {
    case terminalDetailActions.TERMINAL_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case terminalDetailActions.TERMINAL_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case terminalDetailActions.TERMINAL_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    case terminalDetailActions.TERMINAL_DETAIL_POST_REQUEST:
      return {data: state.data, error: null, loading: true};

    case terminalDetailActions.TERMINAL_DETAIL_POST:
      return {data: action.payload, error: null, loading: false};

    case terminalDetailActions.TERMINAL_DETAIL_POST_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
