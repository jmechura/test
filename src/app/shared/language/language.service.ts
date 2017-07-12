import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class LanguageService {
  private languageLoaded$ = new ReplaySubject<boolean>();
  private languages = ['cs', 'en'];

  constructor(private translateService: TranslateService) {
    this.translateService.use('cs').subscribe(
      () => {
        this.languageLoaded$.next(true);
      }
    );
  }

  setLanguage(language: string): void {
    this.translateService.use(language);
  }

  translate(key: string): string {
    return this.translateService.instant(key);
  }

  isLoaded(): Observable<boolean> {
    return this.languageLoaded$.asObservable();
  }

  getLanguages(): string[] {
    return this.languages;
  }

  getSelectedLanguage(): string {
    return this.translateService.currentLang;
  }
}
