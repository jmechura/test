import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { PropertyDefModel } from '../models/property-def.model.';

export const campaignPropertyDefActions = {
  CAMPAIGN_PROPERTY_DEF_GET_REQUEST: 'CAMPAIGN_PROPERTY_DEF_GET_REQUEST',
  CAMPAIGN_PROPERTY_DEF_GET: 'CAMPAIGN_PROPERTY_DEF_GET',
  CAMPAIGN_PROPERTY_DEF_GET_FAIL: 'CAMPAIGN_PROPERTY_DEF_GET_FAIL'
};

const INITIAL_STATE: StateModel<PropertyDefModel[]> = {error: null, loading: false};

export function campaignPropertyDefReducer(state: StateModel<PropertyDefModel[]> = INITIAL_STATE,
                                           action: Action): StateModel<PropertyDefModel[]> {
  switch (action.type) {
    case campaignPropertyDefActions.CAMPAIGN_PROPERTY_DEF_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case campaignPropertyDefActions.CAMPAIGN_PROPERTY_DEF_GET:
      return {data: action.payload, error: null, loading: false};

    case campaignPropertyDefActions.CAMPAIGN_PROPERTY_DEF_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
