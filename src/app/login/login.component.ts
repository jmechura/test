import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../shared/models/app-state.model';
import { authActions } from '../shared/reducers/auth.reducer';
import { Subject } from 'rxjs/Subject';
import { AuthModel } from '../shared/models/auth.model';
import { StateModel } from '../shared/models/state.model';
import { TOKEN_STORAGE_KEY } from '../shared/services/api.service';


@Component({
  selector: 'mss-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  username: string;
  password: string;
  loginForm: FormGroup;

  loading = false;

  private unsubscribe$ = new Subject<void>();

  constructor(fb: FormBuilder, private router: Router, private store: Store<AppState>) {
    this.loginForm = fb.group({
      username: '',
      password: ''
    });

    this.store.select('auth').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<AuthModel>) => {
        this.loading = loading;
        if (error) {
          console.error('Login API call has returned error', error);
          return;
        }

        if (data != undefined) {
          localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
          this.router.navigateByUrl('/platform');

        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  login(): void {
    const payload = {
      login: this.loginForm.get('username').value,
      system: 'DEFAULT',
      password: this.loginForm.get('password').value,
    };
    this.store.dispatch({type: authActions.LOGIN_REQUEST, payload: payload});
  }
}
