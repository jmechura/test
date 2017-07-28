import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { importCodeActions } from '../reducers/import-code.reducer';

const IMPORTS_ENDPOINT = '/imports';
const IMPORTS_CODE_ENDPOINT = '/list/simple';

@Injectable()
export class ImportCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getImportCodes(): Observable<Action> {
    return this.actions$
      .ofType(importCodeActions.IMPORT_CODE_GET_REQUEST)
      .switchMap(action => this.api.get(`${IMPORTS_ENDPOINT}${IMPORTS_CODE_ENDPOINT}`)
        .map(res => ({type: importCodeActions.IMPORT_CODE_GET, payload: res}))
        .catch((res) => Observable.of({type: importCodeActions.IMPORT_CODE_GET_FAIL, payload: res}))
      );
  }
}
