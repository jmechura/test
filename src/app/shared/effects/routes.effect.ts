import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { routesActions } from '../reducers/routes.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const ROUTES_ENDPOINT = '/routing/routes';

@Injectable()
export class RoutesEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect() getRoutes(): Observable<Action> {
    return this.actions$
      .ofType(routesActions.ROUTES_API_GET)
      .switchMap(action => this.api.get(`${ROUTES_ENDPOINT}/${action.payload}`)
        .map(res => ({type: routesActions.ROUTES_GET, payload: res}))
        .catch((res) => Observable.of({type: routesActions.ROUTES_GET_FAIL, payload: res}))
      );
  }

  @Effect() saveRoutes(): Observable<Action> {
    return this.actions$
      .ofType(routesActions.ROUTES_API_POST)
      .switchMap(action => this.api.post(ROUTES_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.saveRoutes');
          return {type: routesActions.ROUTES_POST, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: routesActions.ROUTES_POST_FAIL});
        })
      );
  }
}
