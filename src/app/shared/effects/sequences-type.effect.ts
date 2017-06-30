import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { sequencesTypeActions } from '../reducers/sequences-type.reducer';

const SEQUENCES_TYPE_ENDPOINT = '/sequences/types';

@Injectable()
export class SequencesTypeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTarget(): Observable<Action> {
    return this.actions$
      .ofType(sequencesTypeActions.SEQUENCES_TYPE_API_GET)
      .switchMap(action => this.api.get(SEQUENCES_TYPE_ENDPOINT)
        .map(res => ({type: sequencesTypeActions.SEQUENCES_TYPE_GET, payload: res}))
        .catch((res) => Observable.of({type: sequencesTypeActions.SEQUENCES_TYPE_GET_FAIL, payload: res}))
      );
  }
}
