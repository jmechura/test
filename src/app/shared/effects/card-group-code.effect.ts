import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { cardGroupCodeActions } from '../reducers/card-group-code.reducer';

const CARD_GROUP_CODE_ENDPOINT = '/cardgroups/list/simple';

@Injectable()
export class CardGroupCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getCardGroupCodes(): Observable<Action> {
    return this.actions$
      .ofType(cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST)
      .switchMap(action => this.api.get(`${CARD_GROUP_CODE_ENDPOINT}/${action.payload}`)
        .map(res => ({type: cardGroupCodeActions.CARD_GROUP_CODE_GET, payload: res}))
        .catch((res) => Observable.of({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_FAIL, payload: res}))
      );
  }
}
