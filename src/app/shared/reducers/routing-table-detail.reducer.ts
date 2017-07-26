import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { RoutingTable } from '../models/routin.model';

export const routingTableDetailActions = {
  ROUTING_TABLE_DETAIL_GET_REQUEST: 'ROUTING_TABLE_DETAIL_GET_REQUEST',
  ROUTING_TABLE_DETAIL_GET: 'ROUTING_TABLE_DETAIL_GET',
  ROUTING_TABLE_DETAIL_GET_FAIL: 'ROUTING_TABLE_DETAIL_GET_FAIL',
  ROUTING_TABLE_DETAIL_POST_REQUEST: 'ROUTING_TABLE_DETAIL_POST_REQUEST',
  ROUTING_TABLE_DETAIL_POST: 'ROUTING_TABLE_DETAIL_POST',
  ROUTING_TABLE_DETAIL_POST_FAIL: 'ROUTING_TABLE_DETAIL_POST_FAIL',
};

const INITIAL_STATE: StateModel<RoutingTable> = {error: null, loading: false};

export function routingTableDetailReducer(state: StateModel<RoutingTable> = INITIAL_STATE,
                                          action: Action): StateModel<RoutingTable> {
  switch (action.type) {
    case routingTableDetailActions.ROUTING_TABLE_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case routingTableDetailActions.ROUTING_TABLE_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case routingTableDetailActions.ROUTING_TABLE_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    case routingTableDetailActions.ROUTING_TABLE_DETAIL_POST_REQUEST:
      return {data: state.data, error: null, loading: true};

    case routingTableDetailActions.ROUTING_TABLE_DETAIL_POST:
      return {data: action.payload, error: null, loading: false};

    case routingTableDetailActions.ROUTING_TABLE_DETAIL_POST_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
