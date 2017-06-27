import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { TableRoutes } from '../models/routin.model';

export const routesActions = {
  ROUTES_API_GET: 'ROUTES_API_GET',
  ROUTES_GET: 'ROUTES_GET',
  ROUTES_GET_FAIL: 'ROUTES_GET_FAIL',
  ROUTES_API_POST: 'ROUTES_API_POST',
  ROUTES_POST: 'ROUTES_POST',
  ROUTES_POST_FAIL: 'ROUTES_POST_FAIL',
  ROUTES_API_PUT: 'ROUTES_API_PUT',
  ROUTES_PUT: 'ROUTES_PUT',
  ROUTES_PUT_FAIL: 'ROUTES_PUT_FAIL',
  ROUTES_API_DELETE: 'ROUTES_API_DELETE',
  ROUTES_DELETE: 'ROUTES_DELETE',
  ROUTES_DELETE_FAIL: 'ROUTES_DELETE_FAIL',
};

const INITIAL_STATE: StateModel<TableRoutes[]> = {error: null, loading: false};

export function routesReducer(state: StateModel<TableRoutes[]> = INITIAL_STATE, action: Action): StateModel<TableRoutes[]> {
  switch (action.type) {
    case routesActions.ROUTES_API_GET:
      return {data: state.data, error: null, loading: true};

    case routesActions.ROUTES_GET:
      return {data: action.payload, error: null, loading: false};

    case routesActions.ROUTES_GET_FAIL:
      return {error: action.payload, loading: false};

    case routesActions.ROUTES_API_POST:
      return {data: state.data, error: null, loading: true};

    case routesActions.ROUTES_POST:
      return {data: action.payload, error: null, loading: false};

    case routesActions.ROUTES_POST_FAIL:
      return {error: action.payload, loading: false};

    case routesActions.ROUTES_API_PUT:
      return {data: state.data, error: null, loading: true};

    case routesActions.ROUTES_PUT:
      return {data: action.payload, error: null, loading: false};

    case routesActions.ROUTES_PUT_FAIL:
      return {error: action.payload, loading: false};

    case routesActions.ROUTES_API_DELETE:
      return {data: state.data, error: null, loading: true};

    case routesActions.ROUTES_DELETE:
      return {data: state.data.filter(item => item.id !== action.payload), error: null, loading: false};

    case routesActions.ROUTES_DELETE_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
