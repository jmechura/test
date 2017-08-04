import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { terminalDetailActions } from '../reducers/terminal-detail.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const TERMINAL_DETAIL_ENDPOINT = '/terminals';

@Injectable()
export class TerminalDetailEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect()
  getTerminals(): Observable<Action> {
    return this.actions$
      .ofType(terminalDetailActions.TERMINAL_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${TERMINAL_DETAIL_ENDPOINT}/${action.payload}`)
        .map(res => ({type: terminalDetailActions.TERMINAL_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: terminalDetailActions.TERMINAL_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  postTerminal(): Observable<Action> {
    return this.actions$
      .ofType(terminalDetailActions.TERMINAL_DETAIL_POST_REQUEST)
      .switchMap(action => this.api.post(TERMINAL_DETAIL_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updateTerminal');
          return {type: terminalDetailActions.TERMINAL_DETAIL_POST, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: terminalDetailActions.TERMINAL_DETAIL_POST_FAIL, payload: res});
        })
      );
  }
}
