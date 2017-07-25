import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { templateDetailActions } from '../reducers/template-detail.reducer';

const TEMPLATES_ENDPOINT_LIST = '/users/templates';

@Injectable()
export class TemplateDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getTemplate(): Observable<Action> {
    return this.actions$
      .ofType(templateDetailActions.TEMPLATE_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${TEMPLATES_ENDPOINT_LIST}/${action.payload}`)
        .map(res => ({type: templateDetailActions.TEMPLATE_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: templateDetailActions.TEMPLATE_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  updateTemplate(): Observable<Action> {
    return this.actions$
      .ofType(templateDetailActions.TEMPLATE_DETAIL_PUT_REQUEST)
      .switchMap(action => this.api.put(TEMPLATES_ENDPOINT_LIST, action.payload)
        .map(res => ({type: templateDetailActions.TEMPLATE_DETAIL_PUT, payload: res}))
        .catch((res) => Observable.of({type: templateDetailActions.TEMPLATE_DETAIL_PUT_FAIL, payload: res}))
      );
  }
}
