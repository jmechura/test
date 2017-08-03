import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { terminalActions } from '../reducers/terminal.reducer';
import { LanguageService } from '../services/language.service';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const TERMINAL_ENDPOINT = '/terminals';

@Injectable()
export class TerminalEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private language: LanguageService,
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
  // TODO ?
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
        .map(res => {
          this.toastr.success(this.language.translate('toastr.success.deleteTerminal'));
          return {type: terminalActions.TERMINAL_DELETE, payload: action.payload};
        })
        .catch(() => {
          this.toastr.error(this.language.translate('toastr.error.deleteTerminal'));
          return Observable.of({type: terminalActions.TERMINAL_DELETE_FAIL});
        })
      );
  }
}
