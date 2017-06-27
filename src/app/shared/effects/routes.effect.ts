import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { routesActions } from '../reducers/routes.reducer';

const ROUTES_ENDPOINT = '/routing/routes';

@Injectable()
export class RoutesEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect() getRoutes(): Observable<Action> {
    return this.actions$
      .ofType(routesActions.ROUTES_API_GET)
      .switchMap(action => this.api.get(`${ROUTES_ENDPOINT}/${action.payload}`)
        .map(res => ({type: routesActions.ROUTES_GET, payload: res}))
        .catch((res) => Observable.of({type: routesActions.ROUTES_GET_FAIL, payload: res}))
      );
  }

  @Effect() postRoutes(): Observable<Action> {
    return this.actions$
      .ofType(routesActions.ROUTES_API_POST)
      .switchMap(action => this.api.post(ROUTES_ENDPOINT, action.payload)
        .map(res => ({type: routesActions.ROUTES_POST, payload: res}))
        .catch(() => Observable.of({type: routesActions.ROUTES_POST_FAIL}))
      );
  }

  @Effect() putRoutes(): Observable<Action> {
    return this.actions$
      .ofType(routesActions.ROUTES_API_PUT)
      .switchMap(action => this.api.put(ROUTES_ENDPOINT, action.payload)
        .map(res => ({type: routesActions.ROUTES_PUT, payload: res}))
        .catch(() => Observable.of({type: routesActions.ROUTES_PUT_FAIL}))
      );
  }

  @Effect() deleteRoutes(): Observable<Action> {
    return this.actions$
      .ofType(routesActions.ROUTES_API_DELETE)
      .switchMap(action => this.api.remove(`${ROUTES_ENDPOINT}/${action.payload}`)
        .map(res => ({type: routesActions.ROUTES_DELETE, payload: action.payload}))
        .catch(() => Observable.of({type: routesActions.ROUTES_DELETE_FAIL}))
      );
  }
}
