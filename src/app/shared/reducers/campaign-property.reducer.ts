import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';
import { PropertyModel } from '../models/property.model';

export const campaignPropertyActions = {
  CAMPAIGN_PROPERTY_GET_REQUEST: 'CAMPAIGN_PROPERTY_GET_REQUEST',
  CAMPAIGN_PROPERTY_GET: 'CAMPAIGN_PROPERTY_GET',
  CAMPAIGN_PROPERTY_GET_FAIL: 'CAMPAIGN_PROPERTY_GET_FAIL'
};

const INITIAL_STATE: StateModel<PropertyModel[]> = {error: null, loading: false};

export function campaignPropertyReducer(state: StateModel<PropertyModel[]> = INITIAL_STATE,
                                        action: Action): StateModel<PropertyModel[]> {
  switch (action.type) {
    case campaignPropertyActions.CAMPAIGN_PROPERTY_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case campaignPropertyActions.CAMPAIGN_PROPERTY_GET:
      return {data: action.payload, error: null, loading: false};

    case campaignPropertyActions.CAMPAIGN_PROPERTY_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
