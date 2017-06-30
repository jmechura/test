import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardDetailActions } from '../reducers/card-detail.reducer';

const CARD_DETAIL_ENDPOINT = '/cards';

@Injectable()
export class CardDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCardDetail(): Observable<Action> {
    return this.actions$
      .ofType(cardDetailActions.CARD_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${CARD_DETAIL_ENDPOINT}/${action.payload}`)
        .map(res => ({type: cardDetailActions.CARD_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: cardDetailActions.CARD_DETAIL_GET_FAIL, payload: res}))
      );
  }
}
