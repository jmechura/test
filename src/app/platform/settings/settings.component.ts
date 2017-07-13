import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { profileActions } from '../../shared/reducers/profile.reducer';
import { StateModel } from '../../shared/models/state.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { ApiService } from '../../shared/services/api.service';
import { UnsubscribeSubject, MissingTokenResponse } from '../../shared/utils';
import { LanguageService } from '../../shared/language/language.service';
import { SelectItem } from '../../shared/components/bronze/select/select.component';

@Component({
  selector: 'mss-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  infoForm: FormGroup;
  passwordForm: FormGroup;

  profile: ProfileModel;
  editableProfile: ProfileModel;

  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
  newQuestion: string;
  newAnswer: string;

  questionSwitch = false;
  languages: SelectItem[] = [];
  selectedLanguage: string;

  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private language: LanguageService,
              private api: ApiService) {
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

    // Dispatch to get profile is in platform
    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<ProfileModel>) => {
        if (error instanceof MissingTokenResponse) {
          return;
        }

        if (error) {
          console.error('Account API call returned error', error);
          return;
        }

        if (data != null) {
          this.profile = data;
          this.editableProfile = {...this.profile};
        }
      }
    );
    this.languages = this.language.getLanguages().map(item => ({value: item}));
    this.selectedLanguage = this.language.getSelectedLanguage();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  updateUser(): void {
    this.store.dispatch({type: profileActions.PROFILE_PUT_REQUEST, payload: this.editableProfile});
  }

  updatePassword(): void {
    const newPasswordObject = {
      newPassword: this.newPassword,
      password: this.oldPassword,
      userId: this.profile.id,
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

  selectLanguage(lang: string): void {
    this.language.setLanguage(lang);
    this.selectedLanguage = lang;
  }

}
