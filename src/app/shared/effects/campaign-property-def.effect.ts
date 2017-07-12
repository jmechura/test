import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { campaignPropertyDefActions } from '../reducers/campaign-property-def.reducer';

const PROPERTY_DEF_ENDPOINT = '/campaigns/properties/def';

@Injectable()
export class CampaignPropertyDefEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCampaignPropertyDefs(): Observable<Action> {
    return this.actions$
      .ofType(campaignPropertyDefActions.CAMPAIGN_PROPERTY_DEF_GET_REQUEST)
      .switchMap(action => this.api.get(`${PROPERTY_DEF_ENDPOINT}/${action.payload}`)
        .map(res => ({type: campaignPropertyDefActions.CAMPAIGN_PROPERTY_DEF_GET, payload: res}))
        .catch((res) => Observable.of({type: campaignPropertyDefActions.CAMPAIGN_PROPERTY_DEF_GET_FAIL, payload: res}))
      );
  }
}
