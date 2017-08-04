import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { terminalActions } from '../reducers/terminal.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const TERMINAL_ENDPOINT = '/terminals';

@Injectable()
export class TerminalEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect() getTerminals(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_GET_REQUEST)
      .switchMap(action => this.api.post(`${TERMINAL_ENDPOINT}/list`, action.payload)
        .map(res => ({type: terminalActions.TERMINAL_GET, payload: res}))
        .catch((res) => Observable.of({type: terminalActions.TERMINAL_GET_FAIL, payload: res}))
      );
  }

  @Effect() createTerminal(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_POST_REQUEST)
      .switchMap(action => this.api.post(TERMINAL_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.createTerminal');
          return {type: terminalActions.TERMINAL_POST, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: terminalActions.TERMINAL_POST_FAIL});
        })
      );
  }

  @Effect() updateTerminal(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_PUT_REQUEST)
      .switchMap(action => this.api.put(TERMINAL_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updateTerminal');
          return {type: terminalActions.TERMINAL_PUT, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: terminalActions.TERMINAL_PUT_FAIL});
        })
      );
  }

  @Effect() deleteTerminal(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_DELETE_REQUEST)
      .switchMap(action => this.api.remove(`${TERMINAL_ENDPOINT}/${action.payload}`)
        .map(res => {
          this.toastr.success('toastr.success.deleteTerminal');
          return {type: terminalActions.TERMINAL_DELETE, payload: action.payload};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: terminalActions.TERMINAL_DELETE_FAIL});
        })
      );
  }
}
