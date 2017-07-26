import { Component, OnDestroy } from '@angular/core';
import { ToolbarPosition } from '../shared/components/bronze/toolbar/toolbar.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../shared/models/app-state.model';
import { StateModel } from '../shared/models/state.model';
import { ProfileModel } from '../shared/models/profile.model';
import { profileActions } from '../shared/reducers/profile.reducer';
import { UnsubscribeSubject, MissingTokenResponse } from '../shared/utils';

@Component({
  selector: 'mss-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnDestroy {
  toolbarPosition: ToolbarPosition = 'side';
  profile: ProfileModel;
  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private router: Router, private store: Store<AppStateModel>) {
    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<ProfileModel>) => {
        if (error) {
          if (error instanceof MissingTokenResponse) {
            return;
          }
          console.error('Account API call returned error', error);
          return;
        }

        if (data != null) {
          this.profile = data;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  logOut(): void {
    this.store.dispatch({type: profileActions.PROFILE_DISCARD});
    this.router.navigateByUrl('/login');
  }
}
