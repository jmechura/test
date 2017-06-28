import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { campaignsActions } from '../reducers/campaign.reducer';

const CAMPAIGNS_ENDPOINT_LIST = '/campaigns/list';

@Injectable()
export class CampaignEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCampaigns(): Observable<Action> {
    return this.actions$
      .ofType(campaignsActions.CAMPAIGNS_GET_REQUEST)
      .switchMap(action => this.api.post(CAMPAIGNS_ENDPOINT_LIST, action.payload)
        .map(res => ({type: campaignsActions.CAMPAIGNS_GET, payload: res}))
        .catch((res) => Observable.of({type: campaignsActions.CAMPAIGNS_GET_FAIL, payload: res}))
      );
  }
}
