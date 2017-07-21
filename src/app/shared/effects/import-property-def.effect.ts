import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { importPropertyDefActions } from '../reducers/import-property-def.reducer';

const IMPORT_DEF_ENDPOINT = '/imports/properties/def';

@Injectable()
export class ImportPropertyDefEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getImportPropertyDefs(): Observable<Action> {
    return this.actions$
      .ofType(importPropertyDefActions.IMPORT_PROPERTY_DEF_GET_REQUEST)
      .switchMap(action => this.api.get(`${IMPORT_DEF_ENDPOINT}/${action.payload}`)
        .map(res => ({type: importPropertyDefActions.IMPORT_PROPERTY_DEF_GET, payload: res}))
        .catch((res) => Observable.of({type: importPropertyDefActions.IMPORT_PROPERTY_DEF_GET_FAIL, payload: res}))
      );
  }
}
