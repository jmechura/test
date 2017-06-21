import { Component } from '@angular/core';
import { ToolbarPosition } from '../shared/components/bronze/toolbar/toolbar.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/models/app-state.model';
import { authActions } from '../shared/reducers/auth.reducer';
import { TOKEN_STORAGE_KEY } from '../shared/services/api.service';

const ROUTE_PREFIX = '/platform';

@Component({
  selector: 'mss-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent {

  currentBalance = 0;

  toolbarPosition: ToolbarPosition = 'side';

  toolbarData = [
    {label: 'Přehled', link: ROUTE_PREFIX + '/dashboard', icon: 'dashboard'},
    {label: 'Moje Karta', link: ROUTE_PREFIX + '/card', icon: 'credit_card'},
    {label: 'Nastavení', link: ROUTE_PREFIX + '/settings', icon: 'settings'},
    {label: 'Zaměstnanci', link: ROUTE_PREFIX + '/employees', icon: 'group'},
    {label: 'Showcase', link: ROUTE_PREFIX + '/showcase', icon: 'view_list'},
  ];

  constructor(private router: Router, private store: Store<AppState>) {

  }

  logOut(): void {
    this.store.dispatch({type: authActions.LOGOUT});
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.router.navigateByUrl('/login');
  }
}
