import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { campaignPropertyActions } from '../reducers/campaign-property.reducer';

const PROPERTY_ENDPOINT = '/campaigns/properties';

@Injectable()
export class CampaignPropertyEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCampaignProperties(): Observable<Action> {
    return this.actions$
      .ofType(campaignPropertyActions.CAMPAIGN_PROPERTY_GET_REQUEST)
      .switchMap(action => this.api.get(`${PROPERTY_ENDPOINT}/${action.payload}`)
        .map(res => ({type: campaignPropertyActions.CAMPAIGN_PROPERTY_GET, payload: res}))
        .catch((res) => Observable.of({type: campaignPropertyActions.CAMPAIGN_PROPERTY_GET_FAIL, payload: res}))
      );
  }
}
