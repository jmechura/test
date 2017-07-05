import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardGroupDetailActions } from '../reducers/card-group-detail.reducer';

const CARD_GROUP_ENDPOINT = '/cardgroups';

@Injectable()
export class CardGroupDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCardGroupDetail(): Observable<Action> {
    return this.actions$
      .ofType(cardGroupDetailActions.CARD_GROUP_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${CARD_GROUP_ENDPOINT}/${action.payload}`)
        .map(res => ({type: cardGroupDetailActions.CARD_GROUP_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: cardGroupDetailActions.CARD_GROUP_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect() updateCardGroupDetail(): Observable<Action> {
    return this.actions$
      .ofType(cardGroupDetailActions.CARD_GROUP_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(`${CARD_GROUP_ENDPOINT}`, action.payload)
        .map(res => ({type: cardGroupDetailActions.CARD_GROUP_DETAIL_PUT, payload: res}))
        .catch((res) => Observable.of({type: cardGroupDetailActions.CARD_GROUP_DETAIL_PUT_FAIL, payload: res}))
      );
  }
}
