import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { ruleActions } from '../reducers/rule.reducer';

const RULE_ENDPOINT = '/routing/rules';

@Injectable()
export class RuleEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getRule(): Observable<Action> {
    return this.actions$
      .ofType(ruleActions.RULE_API_GET)
      .switchMap(action => this.api.get(RULE_ENDPOINT)
        .map(res => ({type: ruleActions.RULE_GET, payload: res}))
        .catch((res) => Observable.of({type: ruleActions.RULE_GET_FAIL, payload: res}))
      );
  }
}
