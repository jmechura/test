import { StateModel } from '../models/state.model';
import { Action } from '@ngrx/store';

export const campaignFactoriesActions = {
  CAMPAIGN_FACTORIES_GET_REQUEST: 'CAMPAIGN_FACTORIES_GET_REQUEST',
  CAMPAIGN_FACTORIES_GET: 'CAMPAIGN_FACTORIES_GET',
  CAMPAIGN_FACTORIES_GET_FAIL: 'CAMPAIGN_FACTORIES_GET_FAIL',
};

const INITIAL_STATE: StateModel<string[]> = {error: null, loading: false};

export function campaignFactoriesReducer(state: StateModel<string[]> = INITIAL_STATE, action: Action): StateModel<string[]> {
  switch (action.type) {
    case campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case campaignFactoriesActions.CAMPAIGN_FACTORIES_GET:
      return {data: action.payload, error: null, loading: false};

    case campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
