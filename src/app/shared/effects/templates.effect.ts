import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { templatesActions } from '../reducers/template.reducer';

const TEMPLATES_ENDPOINT_LIST = '/users/templates/list';

@Injectable()
export class TemplatesEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getIssuers(): Observable<Action> {
    return this.actions$
      .ofType(templatesActions.TEMPLATES_GET_REQUEST)
      .switchMap(action => this.api.post(TEMPLATES_ENDPOINT_LIST, action.payload)
        .map(res => ({type: templatesActions.TEMPLATES_GET, payload: res}))
        .catch((res) => Observable.of({type: templatesActions.TEMPLATES_GET_FAIL, payload: res}))
      );
  }
}
