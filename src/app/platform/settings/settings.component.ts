import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { accountActions } from '../../shared/reducers/account.reducer';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { AccountModel } from '../../shared/models/account.model';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'mss-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  infoForm: FormGroup;
  passwordForm: FormGroup;

  account: AccountModel;
  editAccount: AccountModel;

  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  newQuestion: string;
  newAnswer: string;

  questionSwitch = false;

  private unsubscribe$ = new Subject<void>();

  constructor(fb: FormBuilder, private store: Store<AppState>, private api: ApiService) {
    this.infoForm = fb.group({
      firstName: '',
      surname: '',
      id: [{value: null, disabled: true}],
      email: ['', Validators.email],
      phone: null
    });

    this.passwordForm = fb.group({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
      newQuestion: [{value: '', disabled: true}],
      newAnswer: [{value: '', disabled: true}],
    });

    // Dispatch to get account is in platform
    this.store.select('account').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<AccountModel>) => {
        if (error) {
          console.error('Account API call returned error', error);
          return;
        }

        if (data != undefined) {
          this.account = data;
          this.editAccount = Object.assign({}, this.account);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateUser(): void {
    this.store.dispatch({type: accountActions.ACCOUNT_API_PUT, payload: this.editAccount});
  }

  updatePassword(): void {
    const newPasswordObject = {
      newPassword: this.newPassword,
      password: this.oldPassword,
      userId: this.account.id,
    };
    this.api.post('/users/changepassword/own', newPasswordObject).subscribe(
      () => {
        console.info('Change password success');
      },
      error => {
        console.error('Change password API call has returned error', error);
      }
    );
  }


  changeState(): void {
    if (this.questionSwitch) {
      this.passwordForm.controls['newQuestion'].enable();
      this.passwordForm.controls['newAnswer'].enable();
    } else {
      this.passwordForm.controls['newQuestion'].disable();
      this.passwordForm.controls['newAnswer'].disable();
    }
  }


}
