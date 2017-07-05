import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { taxTypeActions } from '../reducers/tax-types.reducer';

const TAX_TYPES_ENDPOINT = '/cardgroups/taxtypes';

@Injectable()
export class TaxTypesEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getTaxTypes(): Observable<Action> {
    return this.actions$
      .ofType(taxTypeActions.TAX_TYPES_GET_REQUEST)
      .switchMap(action => this.api.get(TAX_TYPES_ENDPOINT)
        .map(res => ({type: taxTypeActions.TAX_TYPES_GET, payload: res}))
        .catch((res) => Observable.of({type: taxTypeActions.TAX_TYPES_GET_FAIL, payload: res}))
      );
  }
}
