import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { importActions } from '../reducers/imports.reducer';

const IMPORTS_ENDPOINT = '/imports';
const IMPORTS_GET = 'data/list';

@Injectable()
export class ImportsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getImports(): Observable<Action> {
    return this.actions$
      .ofType(importActions.IMPORTS_GET_REQUEST)
      .switchMap(action => this.api.post(`${IMPORTS_ENDPOINT}/${IMPORTS_GET}`, action.payload)
        .map(res => ({type: importActions.IMPORTS_GET, payload: res}))
        .catch((res) => Observable.of({type: importActions.IMPORTS_GET_FAIL, payload: res}))
      );
  }
}
