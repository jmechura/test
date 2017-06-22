import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardActions } from '../reducers/card.reducer';

const AUTH_ENDPOINT = '/cards/list';

@Injectable()
export class CardEffect {
  constructor(private api: ApiService, private actions$: Actions) {}

  @Effect() getCards(): Observable<Action> {
    return this.actions$
      .ofType(cardActions.CARD_API_GET)
      .switchMap(action => this.api.post(AUTH_ENDPOINT, action.payload)
        .map(res => ({type: cardActions.CARD_GET, payload: res}))
        .catch(() => Observable.of({type: cardActions.CARD_GET_FAIL}))
      );
  }
}
