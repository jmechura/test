import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { importTypeActions } from '../reducers/import-type.reducer';

const IMPORT_TYPE_ENDPOINT = '/imports/types';

@Injectable()
export class ImportTypeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getImportTypes(): Observable<Action> {
    return this.actions$
      .ofType(importTypeActions.IMPORT_TYPE_GET_REQUEST)
      .switchMap(action => this.api.get(IMPORT_TYPE_ENDPOINT)
        .map(res => ({type: importTypeActions.IMPORT_TYPE_GET, payload: res}))
        .catch((res) => Observable.of({type: importTypeActions.IMPORT_TYPE_GET_FAIL, payload: res}))
      );
  }
}
