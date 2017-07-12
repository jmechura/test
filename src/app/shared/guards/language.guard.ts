import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LanguageService } from '../language/language.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CanActivateLanguageGuard implements CanActivate {
  constructor(private language: LanguageService) {
  }

  canActivate(): Observable<boolean> {
    return this.language.isLoaded().first();
  }
}
