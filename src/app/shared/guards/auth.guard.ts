import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../models/app-state.model';
import { UnsubscribeSubject } from '../utils';
import { profileActions, ProfileState } from '../reducers/profile.reducer';
import { RoleService } from '../services/role.service';

const LOGIN_ROUTE = 'login';
const PLATFORM_ROUTE = 'platform';

export const routeToRule: { [childRoute: string]: string } = {
  'dashboard': 'transactions.read',
  'employees': 'users.read',
  'cards': 'cards.read',
  'card-request': 'cardRequests.read',
  'card-groups': 'cardGroups.read',
  'issuers': 'admin.view',
  'routing-table': 'admin.view',
  'merchants': 'merchants.read',
  'org-units': 'orgUnits.read',
  'sequences': 'admin.view',
  'terminal': 'terminals.read',
  'campaigns': 'admin.view',
  'templates': 'admin.view',
  'imports': 'admin.view',
  'admin-reports': 'admin.view',
  'acquirers': 'admin.view',
  'showcase': 'admin.view',
  'reports': 'reports.read'
};

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private store: Store<AppStateModel>, private router: Router, private roleService: RoleService) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<boolean> {
    return new Promise(resolve => {
      const [mainRoute, secondaryRoute] = routerState.url.match(/^\/([a-z-]+)?(?:\/([a-z-]+))?/).slice(1);
      if (mainRoute !== LOGIN_ROUTE && mainRoute !== PLATFORM_ROUTE) {
        // trying to route neither to login nor to platform => do not guard
        resolve(true);
        return;
      }

      const unsubscribe$ = new UnsubscribeSubject();
      let profileGetAttempted = false;
      this.store.select('profile').takeUntil(unsubscribe$).subscribe(
        ({data, error, loading}: ProfileState) => {
          // ignore pending requests
          if (loading) {
            return;
          }

          if (error !== null) {
            // the error might be present in the profile state from earlier; try re-getting the profile
            if (!profileGetAttempted) {
              profileGetAttempted = true;
              this.store.dispatch({type: profileActions.PROFILE_GET_REQUEST});
              return;
            }

            switch (mainRoute) {
              case LOGIN_ROUTE:
                // error getting the profile => permit routing to login
                unsubscribe$.fire();
                resolve(true);
                return;

              case PLATFORM_ROUTE:
                // error getting the profile => force-route to login
                unsubscribe$.fire();
                resolve(false);
                this.router.navigateByUrl(`/${LOGIN_ROUTE}`);
                return;
            }
          }

          if (data == null) {
            // the profile has not been gotten yet; dispatch a get request
            this.store.dispatch({type: profileActions.PROFILE_GET_REQUEST});
            return;
          }

          switch (mainRoute) {
            case LOGIN_ROUTE:
              // valid profile present => force-route to platform
              unsubscribe$.fire();
              resolve(false);
              this.router.navigateByUrl(`/${PLATFORM_ROUTE}`);
              return;

            case PLATFORM_ROUTE:
              // valid profile present => permit routing to platform
              unsubscribe$.fire();
              const rule = routeToRule[secondaryRoute];
              if (rule != undefined) {
                this.roleService.isVisible(rule).subscribe(
                  result => {
                    // TODO: find better solution
                    if (!result && secondaryRoute === 'dashboard') {
                      const resource = data.roles.find(role => role.resource === 'CARD_GROUP');
                      if (resource != null) {
                        this.router.navigateByUrl(`/${PLATFORM_ROUTE}/users`);
                      } else {
                        this.router.navigateByUrl(`/${PLATFORM_ROUTE}/settings`);
                      }
                      resolve(true);
                      return;
                    } else {
                      resolve(result);
                    }
                  }
                );
              } else {
                resolve(true);
              }
              return;
          }
        }
      );
    });
  }
}
