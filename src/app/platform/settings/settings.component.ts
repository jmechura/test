import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { StateModel } from '../../shared/models/state.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { ApiService } from '../../shared/services/api.service';
import { UnsubscribeSubject, MissingTokenResponse } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { orgUnitActions, OrgUnitState } from '../../shared/reducers/org-unit.reducer';
import { OrgUnitModel } from '../../shared/models/org-unit.model';

const SECTIONS = ['USER', 'PASSWORD', 'PAGE'];

@Component({
  selector: 'mss-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  passwordForm: FormGroup;
  profile: ProfileModel;
  languages: SelectItem[] = [];
  selectedLanguage: string;
  sections: SelectItem[] = [];
  visibleSection: SelectItem;
  orgUnit: OrgUnitModel;


  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private language: LanguageService,
              private api: ApiService) {

    this.passwordForm = fb.group({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    });

    this.sections = SECTIONS.map(section => ({
      value: section,
      label: this.language.translate(`settings.sections.${section}`)
    }));
    this.visibleSection = this.sections[0];

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
          if (this.profile.resourceAcquirer === 'ORG_UNIT') {
            this.store.dispatch({
              type: orgUnitActions.ORG_UNIT_GET_REQUEST,
              payload: this.profile.resourceAcquirerId
            });
          }
          this.sections = [...this.sections, ...this.profile.roles.map(role => ({
            value: role.resource,
            label: this.language.translate(`settings.sections.${role.resource}`)
          }))].filter(item => item.value !== 'SYSTEM');
        }
      }
    );
    this.languages = this.language.getLanguages().map(item => ({value: item}));
    this.selectedLanguage = this.language.getSelectedLanguage();

    this.store.select('orgUnit').takeUntil(this.unsubscribe$).subscribe(
      (state: OrgUnitState) => {
        if (state.error !== null) {
          console.error('Error getting org unit', state.error);
          return;
        }

        if (state.data && !state.loading) {
          this.orgUnit = state.data;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }


  updatePassword(): void {
    const newPasswordObject = {
      newPassword: this.passwordForm.get('newPassword'),
      password: this.passwordForm.get('oldPassword'),
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

  selectLanguage(lang: string): void {
    this.language.setLanguage(lang);
    this.selectedLanguage = lang;
  }

  updateOrgUnit(model: OrgUnitModel): void {
    this.store.dispatch({type: orgUnitActions.ORG_UNIT_PUT_REQUEST, payload: model});
  }

}
