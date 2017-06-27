import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { targetActions } from '../reducers/targer.reducer';

const TARGET_ENDPOINT = '/routing/targets';

@Injectable()
export class TargetEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTarget(): Observable<Action> {
    return this.actions$
      .ofType(targetActions.TARGET_API_GET)
      .switchMap(action => this.api.get(TARGET_ENDPOINT)
        .map(res => ({type: targetActions.TARGET_GET, payload: res}))
        .catch((res) => Observable.of({type: targetActions.TARGET_GET_FAIL, payload: res}))
      );
  }
}
