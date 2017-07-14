import { StateModel } from '../models/state.model';
import { CampaignModel } from '../models/campaign.model';
import { Action } from '@ngrx/store';

export const campaignDetailActions = {
  CAMPAIGN_DETAIL_GET_REQUEST: 'CAMPAIGN_DETAIL_GET_REQUEST',
  CAMPAIGN_DETAIL_GET: 'CAMPAIGN_DETAIL_GET',
  CAMPAIGN_DETAIL_GET_FAIL: 'CAMPAIGN_DETAIL_GET_FAIL',
  CAMPAIGN_DETAIL_PUT_REQUEST: 'CAMPAIGN_DETAIL_PUT_REQUEST',
  CAMPAIGN_DETAIL_PUT: 'CAMPAIGN_DETAIL_PUT',
  CAMPAIGN_DETAIL_PUT_FAIL: 'CAMPAIGN_DETAIL_PUT_FAIL'
};

const INITIAL_STATE: StateModel<CampaignModel> = {error: null, loading: false};

export function campaignDetailReducer(state: StateModel<CampaignModel> = INITIAL_STATE,
                                      action: Action): StateModel<CampaignModel> {
  switch (action.type) {
    case campaignDetailActions.CAMPAIGN_DETAIL_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case campaignDetailActions.CAMPAIGN_DETAIL_GET:
      return {data: action.payload, error: null, loading: false};

    case campaignDetailActions.CAMPAIGN_DETAIL_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    case campaignDetailActions.CAMPAIGN_DETAIL_PUT_REQUEST:
      return {data: state.data, error: null, loading: true};

    case campaignDetailActions.CAMPAIGN_DETAIL_PUT:
      return {data: action.payload, error: null, loading: false};

    case campaignDetailActions.CAMPAIGN_DETAIL_PUT_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
