import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardGroupActions } from '../reducers/card-group.reducer';

const CARD_GROUP_ENDPOINT = '/cardgroups';

@Injectable()
export class CardGroupEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCardGroups(): Observable<Action> {
    return this.actions$
      .ofType(cardGroupActions.CARD_GROUPS_GET_REQUEST)
      .switchMap(action => this.api.post(`${CARD_GROUP_ENDPOINT}/list`, action.payload)
        .map(res => ({type: cardGroupActions.CARD_GROUPS_GET, payload: res}))
        .catch((res) => Observable.of({type: cardGroupActions.CARD_GROUPS_GET_FAIL, payload: res}))
      );
  }
}
