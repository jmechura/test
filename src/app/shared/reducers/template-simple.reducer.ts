import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { Pagination } from '../models/pagination.model';
import { IssuerModel } from '../models/issuer.model';
import { TemplateSimpleModel } from '../models/template-simple.model';

export const templatesSimpleActions = {
  TEMPLATES_SIMPLE_GET_REQUEST: 'TEMPLATES_SIMPLE_GET_REQUEST',
  TEMPLATES_SIMPLE_GET: 'TEMPLATES_SIMPLE_GET',
  TEMPLATES_SIMPLE_GET_FAIL: 'TEMPLATES_SIMPLE_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<IssuerModel>> = {error: null, loading: false};

export function templatesSimpleReducer(state: StateModel<TemplateSimpleModel> = INITIAL_STATE,
                                       action: Action): StateModel<TemplateSimpleModel> {
  switch (action.type) {
    case templatesSimpleActions.TEMPLATES_SIMPLE_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case templatesSimpleActions.TEMPLATES_SIMPLE_GET:
      return {data: action.payload, error: null, loading: false};

    case templatesSimpleActions.TEMPLATES_SIMPLE_GET_FAIL:
      return {error: action.payload, loading: false};

    default:
      return state;
  }
}
