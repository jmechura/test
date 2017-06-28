import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { campaignFactoriesActions } from '../reducers/campaign-factories.reducer';

const CAMPAING_FACTORIES_ENDPOINT = '/campaigns/factories';

@Injectable()
export class CampaignFactoriesEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCampaignFactories(): Observable<Action> {
    return this.actions$
      .ofType(campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_REQUEST)
      .switchMap(action => this.api.get(CAMPAING_FACTORIES_ENDPOINT)
        .map(res => ({type: campaignFactoriesActions.CAMPAIGN_FACTORIES_GET, payload: res}))
        .catch((res) => Observable.of({type: campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_FAIL, payload: res}))
      );
  }
}
