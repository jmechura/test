import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { templatesSimpleActions } from '../reducers/template-simple.reducer';

const TEMPLATES_SIMPLE_ENDPOINT_LIST = '/users/templates/list/simple';

@Injectable()
export class TemplatesSimpleEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getTemplatesSimple(): Observable<Action> {
    return this.actions$
      .ofType(templatesSimpleActions.TEMPLATES_SIMPLE_GET_REQUEST)
      .switchMap(action => this.api.post(TEMPLATES_SIMPLE_ENDPOINT_LIST, action.payload)
        .map(res => ({type: templatesSimpleActions.TEMPLATES_SIMPLE_GET, payload: res}))
        .catch((res) => Observable.of({type: templatesSimpleActions.TEMPLATES_SIMPLE_GET_FAIL, payload: res}))
      );
  }
}
