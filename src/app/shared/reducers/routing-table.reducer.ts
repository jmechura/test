import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { RoutingTable } from '../models/routin.model';

export const routingTableActions = {
  ROUTING_TABLE_API_GET: 'ROUTING_TABLE_API_GET',
  ROUTING_TABLE_GET: 'ROUTING_TABLE_GET',
  ROUTING_TABLE_GET_FAIL: 'ROUTING_TABLE_GET_FAIL',
  ROUTING_TABLE_API_POST: 'ROUTING_TABLE_API_POST',
  ROUTING_TABLE_POST: 'ROUTING_TABLE_POST',
  ROUTING_TABLE_POST_FAIL: 'ROUTING_TABLE_POST_FAIL',
  ROUTING_TABLE_API_PUT: 'ROUTING_TABLE_API_PUT',
  ROUTING_TABLE_PUT: 'ROUTING_TABLE_PUT',
  ROUTING_TABLE_PUT_FAIL: 'ROUTING_TABLE_PUT_FAIL',
  ROUTING_TABLE_API_DELETE: 'ROUTING_TABLE_API_DELETE',
  ROUTING_TABLE_DELETE: 'ROUTING_TABLE_DELETE',
  ROUTING_TABLE_DELETE_FAIL: 'ROUTING_TABLE_DELETE_FAIL',
};

const INITIAL_STATE: StateModel<RoutingTable[]> = {error: null, loading: false};

export function routingTableReducer(state: StateModel<RoutingTable[]> = INITIAL_STATE, action: Action): StateModel<RoutingTable[]> {
  switch (action.type) {
    case routingTableActions.ROUTING_TABLE_API_GET:
      return {data: state.data, error: null, loading: true};

    case routingTableActions.ROUTING_TABLE_GET:
      return {data: action.payload, error: null, loading: false};

    case routingTableActions.ROUTING_TABLE_GET_FAIL:
      return {error: action.payload, loading: false};

    case routingTableActions.ROUTING_TABLE_API_POST:
      return {data: state.data, error: null, loading: true};

    case routingTableActions.ROUTING_TABLE_POST:
      return {data: [...state.data, action.payload], error: null, loading: false};

    case routingTableActions.ROUTING_TABLE_POST_FAIL:
      return {error: action.payload, loading: false};

    case routingTableActions.ROUTING_TABLE_API_PUT:
      return {data: state.data, error: null, loading: true};

    case routingTableActions.ROUTING_TABLE_PUT:
      state.data[state.data.findIndex(item => item.name === action.payload.name)] = action.payload;
      return {data: state.data, error: null, loading: false};

    case routingTableActions.ROUTING_TABLE_PUT_FAIL:
      return {error: action.payload, loading: false};

    case routingTableActions.ROUTING_TABLE_API_DELETE:
      return {data: state.data, error: null, loading: true};

    case routingTableActions.ROUTING_TABLE_DELETE:
      return {data: state.data.filter(item => item.name !== action.payload), error: null, loading: false};

    case routingTableActions.ROUTING_TABLE_DELETE_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
