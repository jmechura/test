import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { terminalActions } from '../reducers/terminal.reducer';

const TERMINAL_ENDPOINT = '/terminals';

@Injectable()
export class TerminalEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTerminals(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_GET_REQUEST)
      .switchMap(action => this.api.post(`${TERMINAL_ENDPOINT}/list`, action.payload)
        .map(res => ({type: terminalActions.TERMINAL_GET, payload: res}))
        .catch((res) => Observable.of({type: terminalActions.TERMINAL_GET_FAIL, payload: res}))
      );
  }

  @Effect() postTerminal(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_POST_REQUEST)
      .switchMap(action => this.api.post(TERMINAL_ENDPOINT, action.payload)
        .map(res => ({type: terminalActions.TERMINAL_POST, payload: res}))
        .catch(() => Observable.of({type: terminalActions.TERMINAL_POST_FAIL}))
      );
  }

  @Effect() putTerminal(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_PUT_REQUEST)
      .switchMap(action => this.api.put(TERMINAL_ENDPOINT, action.payload)
        .map(res => ({type: terminalActions.TERMINAL_PUT, payload: res}))
        .catch(() => Observable.of({type: terminalActions.TERMINAL_PUT_FAIL}))
      );
  }

  @Effect() deleteTerminal(): Observable<Action> {
    return this.actions$
      .ofType(terminalActions.TERMINAL_DELETE_REQUEST)
      .switchMap(action => this.api.remove(`${TERMINAL_ENDPOINT}/${action.payload}`)
        .map(res => ({type: terminalActions.TERMINAL_DELETE, payload: action.payload}))
        .catch(() => Observable.of({type: terminalActions.TERMINAL_DELETE_FAIL}))
      );
  }
}
