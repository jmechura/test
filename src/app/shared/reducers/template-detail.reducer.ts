import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { TemplateModel } from '../models/template.model';

export const templateDetailActions = {
  TEMPLATE_DETAIL_GET_REQUEST: 'TEMPLATE_DETAIL_GET_REQUEST',
  TEMPLATE_DETAIL_GET: 'TEMPLATE_DETAIL_GET',
  TEMPLATE_DETAIL_GET_FAIL: 'TEMPLATE_DETAIL_GET_FAIL',
  TEMPLATE_DETAIL_PUT_REQUEST: 'TEMPLATE_DETAIL_PUT_REQUEST',
  TEMPLATE_DETAIL_PUT: 'TEMPLATE_DETAIL_PUT',
  TEMPLATE_DETAIL_PUT_FAIL: 'TEMPLATE_DETAIL_PUT_FAIL',
};

const INITIAL_STATE: StateModel<TemplateModel> = {error: null, loading: false};

export function templateDetailReducer(state: StateModel<TemplateModel> = INITIAL_STATE,
                                      action: Action): StateModel<TemplateModel> {
  switch (action.type) {
    case templateDetailActions.TEMPLATE_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case templateDetailActions.TEMPLATE_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case templateDetailActions.TEMPLATE_DETAIL_GET_FAIL:
      return {error: action.payload, loading: false};

    case templateDetailActions.TEMPLATE_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case templateDetailActions.TEMPLATE_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case templateDetailActions.TEMPLATE_DETAIL_PUT_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
