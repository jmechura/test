import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

export const TOKEN_STORAGE_KEY = 'mss_token';

function parseResponse(response: Response): any {
  try {
    return response.json();
  } catch (error) {
    return response.text();
  }
}

@Injectable()
export class ApiService {

  constructor(private http: Http) {
  }

  request(method: RequestMethod, path: string, payload?: any): Observable<any> {
    const authToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const requestUrl = `${environment.apiUrl}${path}`;
    const requestOptions = {
      method: method,
      body: payload,
      headers: new Headers({...(authToken !== null ? {Authorization: authToken} : null)})
    };
    return this.http.request(requestUrl, requestOptions).map(parseResponse);
  }

  get(path: string): Observable<any> {
    return this.request(RequestMethod.Get, path);
  }

  post(path: string, payload: any): Observable<any> {
    return this.request(RequestMethod.Post, path, payload);
  }

  put(path: string, payload: any): Observable<any> {
    return this.request(RequestMethod.Put, path, payload);
  }
}
