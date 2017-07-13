import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { importPropertyActions } from '../reducers/import-property.reducer';

const IMPORT_ENDPOINT = '/imports/properties';

@Injectable()
export class ImportPropertyEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getImportProperties(): Observable<Action> {
    return this.actions$
      .ofType(importPropertyActions.IMPORT_PROPERTY_GET_REQUEST)
      .switchMap(action => this.api.get(`${IMPORT_ENDPOINT}/${action.payload}`)
        .map(res => ({type: importPropertyActions.IMPORT_PROPERTY_GET, payload: res}))
        .catch((res) => Observable.of({type: importPropertyActions.IMPORT_PROPERTY_GET_FAIL, payload: res}))
      );
  }
}
