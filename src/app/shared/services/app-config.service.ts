import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Http } from '@angular/http';
import { AppConfigModel } from '../models/app-config.model';

const CONFIG_JSON_URL = 'assets/config.json';

@Injectable()
export class AppConfigService {
  private config$ = new ReplaySubject<AppConfigModel>();

  constructor(http: Http) {
    http.get(CONFIG_JSON_URL).map(response => response.json()).subscribe(
      (config: AppConfigModel) => {
        this.config$.next(config);
      },
      error => {
        console.error('APP CONFIG ERROR\n', error);
      }
    );
  }

  get(configKey: string): Observable<any> {
    return this.config$.asObservable().map(config => config[configKey]).first();
  }
}
