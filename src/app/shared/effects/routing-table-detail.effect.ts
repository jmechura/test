import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { routingTableDetailActions } from '../reducers/routing-table-detail.reducer';

const ROUTING_TABLE_DETAIL_ENDPOINT = '/routing/tables';

@Injectable()
export class RoutingTableDetailEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getRoutingTable(): Observable<Action> {
    return this.actions$
      .ofType(routingTableDetailActions.ROUTING_TABLE_DETAIL_GET_REQUEST)
      .switchMap(action => this.api.get(`${ROUTING_TABLE_DETAIL_ENDPOINT}/${action.payload}`)
        .map(res => ({type: routingTableDetailActions.ROUTING_TABLE_DETAIL_GET, payload: res}))
        .catch((res) => Observable.of({type: routingTableDetailActions.ROUTING_TABLE_DETAIL_GET_FAIL, payload: res}))
      );
  }

  @Effect()
  postRoutingTable(): Observable<Action> {
    return this.actions$
      .ofType(routingTableDetailActions.ROUTING_TABLE_DETAIL_POST_REQUEST)
      .switchMap(action => this.api.post(ROUTING_TABLE_DETAIL_ENDPOINT, action.payload)
        .map(res => ({type: routingTableDetailActions.ROUTING_TABLE_DETAIL_POST, payload: res}))
        .catch(res => Observable.of({type: routingTableDetailActions.ROUTING_TABLE_DETAIL_POST_FAIL, payload: res}))
      );
  }
}
