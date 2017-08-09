import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { employeeCardsActions } from '../reducers/employee-cards.reducer';

const CARD_ENDPOINT = '/cards/users/list';

@Injectable()
export class EmployeeCardsEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getCards(): Observable<Action> {
    return this.actions$
      .ofType(employeeCardsActions.EMPLOYEE_CARDS_GET_REQUEST)
      .switchMap(action => this.api.get(CARD_ENDPOINT)
        .map(res => ({type: employeeCardsActions.EMPLOYEE_CARDS_GET, payload: res}))
        .catch((res) => Observable.of({type: employeeCardsActions.EMPLOYEE_CARDS_GET_FAIL, payload: res}))
      );
  }
}
