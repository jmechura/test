import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardStateActions } from '../reducers/card-state.reducer';

const CARD_STATE_ENDPOINT = '/cards/state';
const SIMPLE = '/simple';

@Injectable()
export class CardStateEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCardStates(): Observable<Action> {
    return this.actions$
      .ofType(cardStateActions.CARD_STATE_GET_REQUEST)
      .switchMap(action => this.api.get(`${CARD_STATE_ENDPOINT}${action.payload ? SIMPLE : '' }`)
        .map(res => ({type: cardStateActions.CARD_STATE_GET, payload: res}))
        .catch((res) => Observable.of({type: cardStateActions.CARD_STATE_GET_FAIL, payload: res}))
      );
  }
}
