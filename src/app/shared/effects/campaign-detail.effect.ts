import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { campaignDetailActions } from '../reducers/campaign-detail.reducer';

const CAMPAIGN_ENDPOINT = '/campaigns';

@Injectable()
export class CampaignDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCampaign(): Observable<Action> {
    return this.actions$
      .ofType(campaignDetailActions.CAMPAIGN_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${CAMPAIGN_ENDPOINT}/${action.payload}`)
        .map(res => ({type: campaignDetailActions.CAMPAIGN_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: campaignDetailActions.CAMPAIGN_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect() updateCampaing(): Observable<Action> {
    return this.actions$
      .ofType(campaignDetailActions.CAMPAIGN_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(CAMPAIGN_ENDPOINT, action.payload)
        .map(res => ({type: campaignDetailActions.CAMPAIGN_DETAIL_PUT, payload: res}))
        .catch((res) => Observable.of({type: campaignDetailActions.CAMPAIGN_DETAIL_PUT_FAIL, payload: res}))
      );
  }
}
