import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardRequestStateActions } from '../reducers/card-request-state.reducer';

const CARD_REQUEST_STATE_ENDPOINT = '/cards/requests/state';

@Injectable()
export class CardRequestStateEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCardRequestStates(): Observable<Action> {
    return this.actions$
      .ofType(cardRequestStateActions.CARD_REQUEST_STATE_GET_REQUEST)
      .switchMap(action => this.api.get(`${CARD_REQUEST_STATE_ENDPOINT}`)
        .map(res => ({type: cardRequestStateActions.CARD_REQUEST_STATE_GET, payload: res}))
        .catch((res) => Observable.of({type: cardRequestStateActions.CARD_REQUEST_STATE_GET_FAIL, payload: res}))
      );
  }
}
