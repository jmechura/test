import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { campaignDetailActions } from '../reducers/campaign-detail.reducer';
import { LanguageService } from '../services/language.service';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const CAMPAIGN_ENDPOINT = '/campaigns';

@Injectable()
export class CampaignDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService,
              private language: LanguageService) {
  }

  @Effect() getCampaign(): Observable<Action> {
    return this.actions$
      .ofType(campaignDetailActions.CAMPAIGN_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${CAMPAIGN_ENDPOINT}/${action.payload}`)
        .map(res => ({type: campaignDetailActions.CAMPAIGN_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: campaignDetailActions.CAMPAIGN_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect() updateCampaign(): Observable<Action> {
    return this.actions$
      .ofType(campaignDetailActions.CAMPAIGN_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(CAMPAIGN_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.updateCampaign'));
          return {type: campaignDetailActions.CAMPAIGN_DETAIL_PUT, payload: res};
        })
        .catch((res) => {
          this.toastr.error(this.language.translate('toastr.error.updateCampaign'));
          return Observable.of({type: campaignDetailActions.CAMPAIGN_DETAIL_PUT_FAIL, payload: res});
        })
      );
  }
}
