import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { sequencesActions } from '../reducers/sequences.reducer';

const SEQUENCES_ENDPOINT = '/sequences';

@Injectable()
export class SequencesEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getSequences(): Observable<Action> {
    return this.actions$
      .ofType(sequencesActions.SEQUENCES_GET_REQUEST)
      .switchMap(action => this.api.get(`${SEQUENCES_ENDPOINT}/list/simple`)
        .map(res => ({type: sequencesActions.SEQUENCES_GET, payload: res}))
        .catch((res) => Observable.of({type: sequencesActions.SEQUENCES_GET_FAIL, payload: res}))
      );
  }

  @Effect() postSequences(): Observable<Action> {
    return this.actions$
      .ofType(sequencesActions.SEQUENCES_POST_REQUEST)
      .switchMap(action => this.api.post(SEQUENCES_ENDPOINT, action.payload)
        .map(res => ({type: sequencesActions.SEQUENCES_POST, payload: res}))
        .catch(() => Observable.of({type: sequencesActions.SEQUENCES_POST_FAIL}))
      );
  }

  @Effect() putSequences(): Observable<Action> {
    return this.actions$
      .ofType(sequencesActions.SEQUENCES_PUT_REQUEST)
      .switchMap(action => this.api.put(SEQUENCES_ENDPOINT, action.payload)
        .map(res => ({type: sequencesActions.SEQUENCES_PUT, payload: res}))
        .catch(() => Observable.of({type: sequencesActions.SEQUENCES_PUT_FAIL}))
      );
  }

  @Effect() deleteSequences(): Observable<Action> {
    return this.actions$
      .ofType(sequencesActions.SEQUENCES_DELETE_REQUEST)
      .switchMap(action => this.api
        .remove(`${SEQUENCES_ENDPOINT}/${action.payload.pk.type}/${action.payload.pk.resource}/${action.payload.pk.resourceId}`)
        .map(res => ({type: sequencesActions.SEQUENCES_DELETE, payload: action.payload}))
        .catch(() => Observable.of({type: sequencesActions.SEQUENCES_DELETE_FAIL}))
      );
  }
}
