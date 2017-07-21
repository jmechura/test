import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiService } from '../services/api.service';
import { countryCodeActions } from '../reducers/country-code.reducer';

const COUNTRY_CODE_ENDPOINT = '/base/countries';

@Injectable()
export class CountryCodeEffect {
  constructor(private api: ApiService, private actions$: Actions) {
  }

  @Effect()
  getCountryCodes(): Observable<Action> {
    return this.actions$
      .ofType(countryCodeActions.COUNTRY_CODE_GET_REQUEST)
      .switchMap(action => this.api.get(`${COUNTRY_CODE_ENDPOINT}`)
        .map(res => ({type: countryCodeActions.COUNTRY_CODE_GET, payload: res}))
        .catch((res) => Observable.of({type: countryCodeActions.COUNTRY_CODE_GET_FAIL, payload: res}))
      );
  }
}
