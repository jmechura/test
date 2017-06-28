import { StateModel } from '../models/state.model';
import { Pagination } from '../models/pagination.model';
import { CampaignModel } from '../models/campaign.model';
import { Action } from '@ngrx/store';

export const campaignsActions = {
  CAMPAIGNS_GET_REQUEST: 'CAMPAIGNS_GET_REQUEST',
  CAMPAIGNS_GET: 'CAMPAIGNS_GET',
  CAMPAIGNS_GET_FAIL: 'CAMPAIGNS_GET_FAIL',
};

const INITIAL_STATE: StateModel<Pagination<CampaignModel>> = {error: null, loading: false};

export function campaignsReducer(state: StateModel<Pagination<CampaignModel>> = INITIAL_STATE,
                                 action: Action): StateModel<Pagination<CampaignModel>> {
  switch (action.type) {
    case campaignsActions.CAMPAIGNS_GET_REQUEST:
      return {data: state.data, error: null, loading: true};

    case campaignsActions.CAMPAIGNS_GET:
      return {data: action.payload, error: null, loading: false};

    case campaignsActions.CAMPAIGNS_GET_FAIL:
      return {data: state.data, error: action.payload, loading: false};

    default:
      return state;
  }
}
