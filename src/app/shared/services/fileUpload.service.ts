import { Injectable } from '@angular/core';
import { Headers, Http, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { MissingTokenResponse } from '../utils';
import { TOKEN_STORAGE_KEY } from './api.service';

const UPLOAD_ENDPOINT = '/imports/import';

@Injectable()
export class FileUploadService {
  private apiUrl = '';

  constructor(private http: Http, private config: AppConfigService) {
    this.config.get('apiUrl').subscribe(
      url => this.apiUrl = url
    );
  }

  uploadFile(file: File, importName: string): Observable<string> {
    const authToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (authToken === null) {
      return Observable.throw(new MissingTokenResponse());
    }

    const requestPayload = new FormData();
    requestPayload.append('file', file);
    return this.http.request(`${this.apiUrl}/${UPLOAD_ENDPOINT}`, {
      body: requestPayload,
      method: RequestMethod.Post,
      params: {importname: importName},
      headers: new Headers({...(authToken !== null ? {Authorization: authToken} : null)})
    })
      .map(response => response)
      .catch(response => Observable.throw(response.text()));
  }
}
