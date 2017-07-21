import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { userActions } from '../../shared/reducers/user.reducer';
import { ActivatedRoute } from '@angular/router';
import { StateModel } from '../../shared/models/state.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ProfileModel } from 'app/shared/models/profile.model';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnsubscribeSubject } from '../../shared/utils';

interface InfoModel {
  label: string;
  value: any;
  formName?: string;
  type?: string;
  options?: SelectItem[];
}

@Component({
  selector: 'mss-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  user: ProfileModel;

  detailOptions: SelectItem[] = [
    {value: 'Basic', label: this.langService.translate('employees.detail.basic')},
    {value: 'Personal', label: this.langService.translate('employees.detail.personal')},
    {value: 'Roles', label: this.langService.translate('employees.detail.roles')},
    {value: 'Cards', label: this.langService.translate('employees.detail.cards')}
  ];
  selectedOption = this.detailOptions[0];

  basicInfo: InfoModel[][];
  personalInfo: InfoModel[][];
  roleInfo: any[];
  stateOptions: SelectItem[] = [{value: 'ENABLED'}, {value: 'DISABLED'}];

  editing = false;

  userForm: FormGroup;

  setSelectedOption(newIndex: SelectItem): void {
    this.selectedOption = newIndex;
  }

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private fb: FormBuilder) {

    this.userForm = this.fb.group(
      {
        id: [''],
        login: [''],
        blocked: [false],
        state: ['ENABLED'],
        firstLogon: [false],
        passwordExpired: [false],
        firstName: [''],
        lastName: [''],
        email: [''],
        phone: [''],
        street: [''],
        city: [''],
        zip: [''],
      }
    );

    this.route.params.subscribe(
      (params: { id: string }) => {
        this.store.dispatch({type: userActions.USER_GET_REQUEST, payload: params.id});
      }
    );

    this.store.select('user').takeUntil(this.unsubscribe$).subscribe(
      (state: StateModel<ProfileModel>) => {
        if (state.error !== null) {
          console.error('User API call returned error', state.error);
          return;
        }
        if (state.data) {
          this.user = state.data;
          this.userForm.patchValue(this.user);
          this.basicInfo = [
            [
              {
                label: this.langService.translate('basic.id'),
                value: this.user.id,
                formName: 'id',
              },
              {
                label: this.langService.translate('employees.dictionary.login'),
                value: this.user.login,
                formName: 'login',
              },
              {
                label: this.langService.translate('employees.dictionary.blocked'),
                value: this.user.blocked,
                formName: 'blocked',
                type: 'toggle'
              },
            ],
            [
              {
                label: this.langService.translate('dictionary.state'),
                value: this.user.state,
                formName: 'state',
                type: 'select',
                options: this.stateOptions
              },
              {
                label: this.langService.translate('employees.dictionary.firstLogon'),
                value: this.user.firstLogon,
                formName: 'firstLogon',
                type: 'toggle'
              },
              {
                label: this.langService.translate('employees.dictionary.passwordExpired'),
                value: this.user.passwordExpired,
                formName: 'passwordExpired',
                type: 'toggle'
              },
            ],
          ];
          this.personalInfo = [
            [
              {
                label: this.langService.translate('basic.firstName'),
                value: this.user.firstName,
                formName: 'firstName',
              },
              {
                label: this.langService.translate('basic.lastName'),
                value: this.user.lastName,
                formName: 'lastName',
              },
              {
                label: this.langService.translate('basic.email'),
                value: this.user.email,
                formName: 'email',
              },
              {
                label: this.langService.translate('basic.phone'),
                value: this.user.phone,
                formName: 'phone',
              },
            ],
            [
              {
                label: this.langService.translate('basic.street'),
                value: this.user.street,
                formName: 'street',
              },
              {
                label: this.langService.translate('basic.city'),
                value: this.user.city,
                formName: 'city',
              },
              {
                label: this.langService.translate('basic.zip'),
                value: this.user.zip,
                formName: 'zip',
              },
            ],
          ];
          this.roleInfo = this.user.roles.map(role => ({
            authorities: role.authorities.join(', '),
            resource: role.resource,
            resourceId: role.resourceId,
          }));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  startEditing(): void {
    this.editing = true;
  }

  cancelEditing(): void {
    this.editing = false;
    this.userForm.patchValue(this.user);
  }

  submitEdit(): void {
    this.editing = false;
    const editedUser = this.userForm.value;
    Object.keys(editedUser).forEach(key => {
      if (editedUser[key] == null) {
        delete editedUser[key];
      }
    });
    this.store.dispatch({type: userActions.USER_PUT_REQUEST, payload: editedUser});
  }
}
