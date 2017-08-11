import { Action } from '@ngrx/store';
import { StateModel } from '../models/state.model';
import { SequencesModel } from '../models/sequences.model';

export const sequencesActions = {
  SEQUENCES_GET_REQUEST: 'SEQUENCES_GET_REQUEST',
  SEQUENCES_GET: 'SEQUENCES_GET',
  SEQUENCES_GET_FAIL: 'SEQUENCES_GET_FAIL',
  SEQUENCES_DELETE_REQUEST: 'SEQUENCES_DELETE_REQUEST',
  SEQUENCES_DELETE: 'SEQUENCES_DELETE',
  SEQUENCES_DELETE_FAIL: 'SEQUENCES_DELETE_FAIL',
};

const INITIAL_STATE: StateModel<SequencesModel[]> = {error: null, loading: false};

export function sequencesReducer(state: StateModel<SequencesModel[]> = INITIAL_STATE, action: Action): StateModel<SequencesModel[]> {
  switch (action.type) {
    case sequencesActions.SEQUENCES_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case sequencesActions.SEQUENCES_GET:
      return {data: action.payload, error: null, loading: false};

    case sequencesActions.SEQUENCES_GET_FAIL:
      return {error: action.payload, loading: false};

    case sequencesActions.SEQUENCES_DELETE_REQUEST:
      return {data: state.data, error: null, loading: true};

    case sequencesActions.SEQUENCES_DELETE:
      return {
        data: state.data.filter(item =>
          (item.pk.resourceId !== action.payload.pk.resourceId) ||
          (item.pk.type !== action.payload.pk.type) ||
          (item.pk.resource !== action.payload.pk.resource)
        ), error: null, loading: false
      };

    case sequencesActions.SEQUENCES_DELETE_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
