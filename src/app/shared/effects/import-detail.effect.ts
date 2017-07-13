import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { importDetailActions } from '../reducers/import-detail.reducer';

const IMPORT_ENDPOINT = '/imports/data';
const IMPORT_EDIT_ENDPOINT = '/imports';

@Injectable()
export class ImportDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getImport(): Observable<Action> {
    return this.actions$
      .ofType(importDetailActions.IMPORT_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${IMPORT_ENDPOINT}/${action.payload}`)
        .map(res => ({type: importDetailActions.IMPORT_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: importDetailActions.IMPORT_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect() editImport(): Observable<Action> {
    return this.actions$
      .ofType(importDetailActions.IMPORT_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(`${IMPORT_EDIT_ENDPOINT}`, action.payload)
        .map(res => ({type: importDetailActions.IMPORT_DETAIL_PUT, payload: res}))
        .catch((res) => Observable.of({type: importDetailActions.IMPORT_DETAIL_PUT_FAIL, payload: res}))
      );
  }
}
