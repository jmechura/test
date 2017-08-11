import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { sequencesActions } from '../reducers/sequences.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const SEQUENCES_ENDPOINT = '/sequences';

@Injectable()
export class SequencesEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect() getSequences(): Observable<Action> {
    return this.actions$
      .ofType(sequencesActions.SEQUENCES_GET_REQUEST)
      .switchMap(action => this.api.get(`${SEQUENCES_ENDPOINT}/list/simple`)
        .map(res => ({type: sequencesActions.SEQUENCES_GET, payload: res}))
        .catch((res) => Observable.of({type: sequencesActions.SEQUENCES_GET_FAIL, payload: res}))
      );
  }

  @Effect() deleteSequence(): Observable<Action> {
    return this.actions$
      .ofType(sequencesActions.SEQUENCES_DELETE_REQUEST)
      .switchMap(action => this.api
        .remove(`${SEQUENCES_ENDPOINT}/${action.payload.pk.type}/${action.payload.pk.resource}/${action.payload.pk.resourceId}`)
        .map(res => {
          this.toastr.success('toastr.success.deleteSequence');
          return {type: sequencesActions.SEQUENCES_DELETE, payload: action.payload};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: sequencesActions.SEQUENCES_DELETE_FAIL});
        })
      );
  }
}
