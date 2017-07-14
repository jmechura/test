import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LoginModel } from '../models/login.model';
import { parseResponse, MissingTokenResponse } from '../utils';
import { AppConfigService } from './app-config.service';

const LOGIN_ENDPOINT = '/login';
const TOKEN_STORAGE_KEY = 'mss_token';

@Injectable()
export class ApiService {
  constructor(private http: Http, private appConfig: AppConfigService) {}

  acquireToken(login: LoginModel): Observable<void> {
    return this.post(LOGIN_ENDPOINT, login, false).map(
      ({token}: {token: string}) => {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    );
  }

  discardToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  get(path: string, tokenRequired: boolean = true): Observable<any> {
    return this.request(RequestMethod.Get, path, null, tokenRequired);
  }

  post(path: string, payload: any, tokenRequired: boolean = true): Observable<any> {
    return this.request(RequestMethod.Post, path, payload, tokenRequired);
  }

  put(path: string, payload: any, tokenRequired: boolean = true): Observable<any> {
    return this.request(RequestMethod.Put, path, payload, tokenRequired);
  }

  remove(path: string, tokenRequired: boolean = true): Observable<any> {
    return this.request(RequestMethod.Delete, path, null, tokenRequired);
  }

  private request(method: RequestMethod, path: string, payload: any, tokenRequired: boolean): Observable<any> {
    const authToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (tokenRequired && authToken === null) {
      return Observable.throw(new MissingTokenResponse());
    }

    return this.appConfig.get('apiUrl').switchMap(apiUrl => {
      const requestUrl = `${apiUrl}${path}`;
      const requestOptions = {
        method: method,
        body: payload,
        headers: new Headers({...(authToken !== null ? {Authorization: authToken} : null)})
      };
      return this.http.request(requestUrl, requestOptions).map(parseResponse);
    });
  }
}
