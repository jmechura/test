import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../models/app-state.model';
import { UnsubscribeSubject } from '../utils';
import { profileActions, ProfileState } from '../reducers/profile.reducer';

const LOGIN_ROUTE = 'login';
const PLATFORM_ROUTE = 'platform';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private store: Store<AppStateModel>, private router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Promise<boolean> {
    return new Promise(resolve => {
      const route = routerState.url.match(/^\/([a-z-]+)?/)[1];
      if (route !== LOGIN_ROUTE && route !== PLATFORM_ROUTE) {
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

            switch (route) {
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

          switch (route) {
            case LOGIN_ROUTE:
              // valid profile present => force-route to platform
              unsubscribe$.fire();
              resolve(false);
              this.router.navigateByUrl(`/${PLATFORM_ROUTE}`);
              return;

            case PLATFORM_ROUTE:
              // valid profile present => permit routing to platform
              unsubscribe$.fire();
              resolve(true);
              return;
          }
        }
      );
    });
  }
}
