import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { ExtendedToastrService } from '../services/extended-toastr.service';
import { sequencesDetailActions } from '../reducers/sequences-detail.reducer';

const SEQUENCES_DETAIL_ENDPOINT = '/sequences';

@Injectable()
export class SequencesDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect()
  getSequences(): Observable<Action> {
    return this.actions$
      .ofType(sequencesDetailActions.SEQUENCES_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${SEQUENCES_DETAIL_ENDPOINT}/${action.payload}`)
        .map(res => ({type: sequencesDetailActions.SEQUENCES_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: sequencesDetailActions.SEQUENCES_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  editSequences(): Observable<Action> {
    return this.actions$
      .ofType(sequencesDetailActions.SEQUENCES_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(SEQUENCES_DETAIL_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updateSequence');
          return {type: sequencesDetailActions.SEQUENCES_DETAIL_PUT, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: sequencesDetailActions.SEQUENCES_DETAIL_PUT_FAIL, payload: res});
        })
      );
  }
}
