import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardRequestActions } from '../reducers/card-request.reducer';

const CARD_REQUEST_ENDPOINT = '/cards/requests/list';

@Injectable()
export class CardRequestEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCardRequests(): Observable<Action> {
    return this.actions$
      .ofType(cardRequestActions.CARD_REQUEST_GET_REQUEST)
      .switchMap(action => this.api.post(CARD_REQUEST_ENDPOINT, action.payload)
        .map(res => ({type: cardRequestActions.CARD_REQUEST_GET, payload: res}))
        .catch((res) => Observable.of({type: cardRequestActions.CARD_REQUEST_GET_FAIL, payload: res}))
      );
  }
}

