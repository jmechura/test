import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { routingTableActions } from '../reducers/routing-table.reducer';
import { ExtendedToastrService } from '../services/extended-toastr.service';

const ROUTING_TABLE_ENDPOINT = '/routing/tables';

@Injectable()
export class RoutingTableEffect {
  constructor(private api: ApiService,
              private actions$: Actions,
              private toastr: ExtendedToastrService) {
  }

  @Effect() getRoutingTable(): Observable<Action> {
    return this.actions$
      .ofType(routingTableActions.ROUTING_TABLE_API_GET)
      .switchMap(action => this.api.get(ROUTING_TABLE_ENDPOINT)
        .map(res => ({type: routingTableActions.ROUTING_TABLE_GET, payload: res}))
        .catch((res) => Observable.of({type: routingTableActions.ROUTING_TABLE_GET_FAIL, payload: res}))
      );
  }

  @Effect() createRoutingTable(): Observable<Action> {
    return this.actions$
      .ofType(routingTableActions.ROUTING_TABLE_API_POST)
      .switchMap(action => this.api.post(ROUTING_TABLE_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.createRoutingTable');
          return {type: routingTableActions.ROUTING_TABLE_POST, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: routingTableActions.ROUTING_TABLE_POST_FAIL});
        })
      );
  }

  @Effect() updateRoutingTable(): Observable<Action> {
    return this.actions$
      .ofType(routingTableActions.ROUTING_TABLE_API_PUT)
      .switchMap(action => this.api.put(ROUTING_TABLE_ENDPOINT, action.payload)
        .map(res => {
          this.toastr.success('toastr.success.updateRoutingTable');
          return {type: routingTableActions.ROUTING_TABLE_PUT, payload: res};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: routingTableActions.ROUTING_TABLE_PUT_FAIL});
        })
      );
  }

  @Effect() deleteRoutingTable(): Observable<Action> {
    return this.actions$
      .ofType(routingTableActions.ROUTING_TABLE_API_DELETE)
      .switchMap(action => this.api.remove(`${ROUTING_TABLE_ENDPOINT}/${action.payload}`)
        .map(res => {
          this.toastr.success('toastr.success.deleteRoutingTable');
          return {type: routingTableActions.ROUTING_TABLE_DELETE, payload: action.payload};
        })
        .catch(res => {
          this.toastr.error(res);
          return Observable.of({type: routingTableActions.ROUTING_TABLE_DELETE_FAIL});
        })
      );
  }
}
