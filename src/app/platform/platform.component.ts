import { Component, OnDestroy } from '@angular/core';
import { ToolbarPosition } from '../shared/components/bronze/toolbar/toolbar.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/models/app-state.model';
import { authActions } from '../shared/reducers/auth.reducer';
import { TOKEN_STORAGE_KEY } from '../shared/services/api.service';
import { Subject } from 'rxjs/Subject';
import { accountActions } from '../shared/reducers/account.reducer';
import { StateModel } from '../shared/models/state.model';
import { AccountModel } from '../shared/models/account.model';

const ROUTE_PREFIX = '/platform';

@Component({
  selector: 'mss-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnDestroy {

  currentBalance = 0;

  toolbarPosition: ToolbarPosition = 'side';

  account: AccountModel;

  toolbarData = [
    {label: 'Přehled', link: ROUTE_PREFIX + '/dashboard', icon: 'dashboard'},
    {label: 'Moje Karta', link: ROUTE_PREFIX + '/card', icon: 'credit_card'},
    {label: 'Nastavení', link: ROUTE_PREFIX + '/settings', icon: 'settings'},
    {label: 'Zaměstnanci', link: ROUTE_PREFIX + '/employees', icon: 'group'},
    {label: 'Přehled karet', link: ROUTE_PREFIX + '/employer-card', icon: 'markunread_mailbox'},
    {label: 'Vydavatelé karet', link: ROUTE_PREFIX + '/issuers', icon: 'card_giftcard'},
    {label: 'Žádosti o kartu', link: ROUTE_PREFIX + '/card-request', icon: 'markunread_mailbox'},
    {label: 'Routovací tabulka', link: ROUTE_PREFIX + '/routing-table', icon: 'view_list'},
    {label: 'Obchodníci', link: ROUTE_PREFIX + '/merchants', icon: 'monetization_on'},
    {label: 'Sequence', link: ROUTE_PREFIX + '/sequences', icon: 'timeline'},
    {label: 'Terminal', link: ROUTE_PREFIX + '/terminal', icon: 'local_atm'},
    {label: 'Kampaně', link: ROUTE_PREFIX + '/campaigns', icon: 'dns'},
    {label: 'Showcase', link: ROUTE_PREFIX + '/showcase', icon: 'view_list'},
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router, private store: Store<AppState>) {
    this.store.dispatch({type: accountActions.ACCOUNT_API_GET});

    this.store.select('account').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<AccountModel>) => {
        if (error) {
          console.error('Account API call returned error', error);
          return;
        }

        if (data != undefined) {
          this.account = data;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logOut(): void {
    this.store.dispatch({type: authActions.LOGOUT});
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.router.navigateByUrl('/login');
  }
}
