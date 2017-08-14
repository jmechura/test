import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { PathNavigationModel } from '../../../models/path-navigation.model';
import { Subject } from 'rxjs/Subject';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'mss-path-navigation',
  templateUrl: './path-navigation.component.html',
  styleUrls: ['./path-navigation.component.scss']
})
export class PathNavigationComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  path: PathNavigationModel[];

  constructor(private location: Location,
              private router: Router,
              private language: LanguageService) {
    this.router.events.takeUntil(this.unsubscribe$).filter(event => event instanceof NavigationEnd).subscribe(
      ({urlAfterRedirects}: NavigationEnd) => {
        let pathItems = urlAfterRedirects.split('/');
        pathItems = pathItems.splice(2, pathItems.length); // remove empty string at beginning and 'platform'
        if (pathItems.length > 2) {
          pathItems = [pathItems[0], pathItems.slice(1, pathItems.length).join('/')];
        }
        this.path = pathItems.map((item, index) => ({
          title: (index === pathItems.length - 2 || item !== 'create') ? item : this.language.translate(`menu.${item}`),
          path: `platform/${[...pathItems].splice(0, index + 1).join('/')}`
        }));
      }
    );
  }

  back(): void {
    this.location.back();
  }

  redirect(item: PathNavigationModel): void {
    this.router.navigate([item.path]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
