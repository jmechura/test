import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { userActions } from '../../shared/reducers/user.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { StateModel } from '../../shared/models/state.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ProfileModel } from 'app/shared/models/profile.model';
import { LanguageService } from '../../shared/services/language.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { UserSections } from '../../shared/enums/user-sections.enum';
import { TemplateSimpleModel } from '../../shared/models/template-simple.model';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { ApiService } from '../../shared/services/api.service';
import { optionalEmailValidator } from '../../shared/validators/optional-email.validator';
import { templatesSimpleActions } from '../../shared/reducers/template-simple.reducer';
import { RoleService } from 'app/shared/services/role.service';
import { CodeModel } from '../../shared/models/code.model';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';

const USERS_ROUTE = 'platform/users';

@Component({
  selector: 'mss-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  user: ProfileModel;
  profile: ProfileModel;

  completeView = true;
  editing = false;

  tabsOptions: SelectItem[] = [];
  visibleTab: SelectItem;

  roleInfo: any[];
  stateOptions: SelectItem[] = [{value: 'ENABLED'}, {value: 'DISABLED'}];

  addUserForm: FormGroup;
  userForm: FormGroup;

  ComponentMode = ComponentMode;
  mode: ComponentMode;

  UserSections = UserSections;

  templates: TemplateSimpleModel[] = [];
  templatesOptions = [];

  itemsForSelect: { [key: string]: SelectItem[]; } = {};

  loading = false;

  @Input()
  set userId(id: string) {
    this.store.dispatch({type: userActions.USER_GET_REQUEST, payload: id});
    this.completeView = false;
    this.visibleTab.value = UserSections.PERSONAL;
    this.mode = ComponentMode.View;
    this.userForm.get('login').disable();
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: ApiService,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private fb: FormBuilder,
              private roles: RoleService) {

    this.addUserForm = fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      passwordAgain: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [optionalEmailValidator, Validators.required]],
      phone: ['', Validators.pattern(/^\+42[0-9]{10}$/)],
      city: [''],
      street: [''],
      zip: [''],
      template: ['', Validators.required],
      resources: fb.array([]),
    });

    this.userForm = this.fb.group({
      id: ['', Validators.required],
      login: ['', Validators.required],
      blocked: [false],
      state: ['ENABLED'],
      firstLogon: [false],
      passwordExpired: [false],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [optionalEmailValidator, Validators.required]],
      phone: ['', Validators.pattern(/^\+42[0-9]{10}$/)],
      street: [''],
      city: [''],
      zip: [''],
    });

    this.route.params.subscribe(
      (params: { id: string }) => {
        if (!params.id) {
          return;
        }
        if (params.id !== 'create') {
          this.mode = ComponentMode.View;
          this.tabsOptions = [
            {
              value: UserSections.BASIC,
              label: this.langService.translate(`users.detail.basic`)
            },
            {
              value: UserSections.PERSONAL,
              label: this.langService.translate(`users.detail.personal`)
            },
            {
              value: UserSections.ROLES,
              label: this.langService.translate(`users.detail.roles`)
            },
            {
              value: UserSections.CARDS,
              label: this.langService.translate(`users.detail.cards`)
            },
          ];
          this.visibleTab = this.tabsOptions[0];
          this.store.dispatch({type: userActions.USER_GET_REQUEST, payload: params.id});
        } else {
          this.mode = ComponentMode.Create;
          this.tabsOptions = [
            {
              value: UserSections.BASIC,
              label: this.langService.translate(`users.detail.basic`)
            },
            {
              value: UserSections.PERSONAL,
              label: this.langService.translate(`users.detail.personal`)
            },
            {
              value: UserSections.TEMPLATE,
              label: this.langService.translate(`users.detail.template`)
            },
          ];
          this.visibleTab = this.tabsOptions[0];
          this.addUserForm.reset();
          this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
            ({data, error, loading}: StateModel<ProfileModel>) => {
              this.loading = loading;
              if (error) {
                if (error instanceof MissingTokenResponse) {
                  return;
                }
                console.error('Account API call has returned error', error);
                return;
              }
              if (data != null && !loading) {
                this.profile = data;
                this.roles.isVisible('createEdit.issuerCodeSelect').subscribe(
                  issuerResult => {
                    if (issuerResult) {
                      this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
                    } else {
                      this.roles.isVisible('createEdit.cardGroupCodeSelect').subscribe(
                        cardGroupResult => {
                          if (cardGroupResult) {
                            this.store.dispatch({
                              type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST,
                              payload: this.profile.resourceId
                            });
                          }
                        }
                      );
                    }
                  }
                );

                this.roles.isVisible('createEdit.networkCodeSelect').subscribe(
                  networkResult => {
                    if (networkResult) {
                      this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
                    } else {
                      this.roles.isVisible('createEdit.merchantCodeSelect').subscribe(
                        merchResult => {
                          if (merchResult) {
                            this.store.dispatch({
                              type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST,
                              payload: this.profile.resourceAcquirerId
                            });
                          } else {
                            this.roles.isVisible('createEdit.orgUnitCodeSelect').subscribe(
                              orgUnitResult => {
                                if (orgUnitResult) {
                                  this.store.dispatch({
                                    type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST,
                                    payload: this.profile.resourceAcquirerId
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );

    this.store.select('user').takeUntil(this.unsubscribe$).subscribe(
      (state: StateModel<ProfileModel>) => {
        if (state.error !== null) {
          console.error('User API call returned error', state.error);
          return;
        }
        if (state.data != undefined && !state.loading && !(this.mode && this.mode === ComponentMode.Create)) {
          this.user = state.data;
          this.userForm.patchValue(this.user);
          this.roleInfo = this.user.roles.map(role => ({
            authorities: role.authorities.join(', '),
            resource: role.resource,
            resourceId: role.resourceId,
          }));
        }
      }
    );

    this.store.select('templatesSimple').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<TemplateSimpleModel[]>) => {
        this.loading = loading;
        if (error) {
          console.error('Templates API call has returned error', error);
          return;
        }
        if (data != null) {
          this.templates = data;
          this.templatesOptions = this.templates.map((item) => ({value: item.id, label: item.name}));
        }
      }
    );
    this.store.dispatch({type: templatesSimpleActions.TEMPLATES_SIMPLE_GET_REQUEST});

    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting network codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.itemsForSelect['NETWORK'] = data.data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting issuer codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.itemsForSelect['MERCHANT'] = data.data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );

    this.store.select('orgUnitCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting org unit codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.itemsForSelect['ORG_UNIT'] = data.data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );

    this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting card group codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.itemsForSelect['CARD_GROUP'] = data.data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );

    this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting issuer codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.itemsForSelect['ISSUER'] = data.data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );
  }

  getTemplateResourcesOptionsByIndex(index: number): SelectItem[] {
    if (this.templates.filter(item => item.id === this.addUserForm.get('template').value)[0]) {
      const label = this.getResourceLabel(index);
      if (this.isContextEqual(label)) {
        return this.getContextValue(label);
      }
      return this.itemsForSelect[label];
    } else {
      return [];
    }
  }

  getTemplateResourcesOptionsByName(name: string): SelectItem[] {
    if (this.isContextEqual(name)) {
      this.getContextValue(name);
    }
    return this.itemsForSelect[name];
  }

  getResourceLabel(index: number): string {
    if (this.templates.filter(item => item.id === this.addUserForm.get('template').value)[0]) {
      return this.templates.filter(item => item.id === this.addUserForm.get('template').value)[0].resources[index].resource;
    } else {
      return '';
    }
  }

  isContextEqual(context: string): boolean {
    return this.profile.resource === context || this.profile.resourceAcquirer === context;
  }

  getContextValue(context: string): SelectItem[] {
    if (this.profile.resource === context) {
      return [{value: this.profile.resourceId, label: this.profile.resourceId}];
    } else if (this.profile.resourceAcquirer === context) {
      return [{value: this.profile.resourceAcquirerId, label: this.profile.resourceAcquirerId}];
    }
  }

  selectCode(value: string, type: string): void {
    switch (type) {
      case 'ORG_UNIT':
        this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: value});
        break;

      case 'MERCHANT':
        this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: value});
        break;

      case 'CARD_GROUP':
        this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: value});
        break;
    }
  }

  onChangeTemplate(value: number): void {
    const template = this.templates.find(item => item.id === value);
    if (template) {
      this.clearResources();
      for (const res of template.resources) {
        this.addResource(res.resource, res.id);
      }
    }
  }

  get resources(): FormArray {
    return this.addUserForm.get('resources') as FormArray;
  };

  addResource(resource: string, id: number): void {
    this.resources.push(
      this.fb.group({
        id: [id],
        resource: [resource],
        resourceId: ['', Validators.required],
        networkCode: ['']
      })
    );
  }

  clearResources(): void {
    this.addUserForm.setControl('resources', this.fb.array([]));
  }

  isInvalid(value: string): boolean {
    const item = this.mode === ComponentMode.Create ? this.addUserForm.get(value) : this.userForm.get(value);
    return item.touched && item.invalid;
  }

  isInvalidEmail(): boolean {
    const item = this.mode === ComponentMode.Create ? this.addUserForm.get('email') : this.userForm.get('email');
    return item.touched && item.errors && item.errors.email;
  }

  isValidPhone(): boolean {
    const item = this.mode === ComponentMode.Create ? this.addUserForm.get('phone') : this.userForm.get('phone');
    return item.touched && item.errors && item.errors.pattern;
  }

  get isPasswordsEqual(): boolean {
    const passwordControl = this.addUserForm.get('password');
    const passwordAgainControl = this.addUserForm.get('passwordAgain');
    return passwordControl.value === passwordAgainControl.value;
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
    this.mode = ComponentMode.View;
  }

  cancelCreateNewUser(): void {
    this.router.navigateByUrl(`${USERS_ROUTE}`);
  }

  createNewUser(): void {
    const newUser = {
      ...this.addUserForm.value,
      template: {
        id: this.addUserForm.get('template').value,
        name: this.templates.filter(item => item.id === this.addUserForm.get('template').value)[0].name,
        resources: [...this.addUserForm.get('resources').value.map(item => ({
          id: item.id,
          resource: item.resource,
          resourceId: item.resourceId
        }))]
      }
    };
    delete newUser.passwordAgain;
    delete newUser.resources;
    this.api.post('/users', newUser).subscribe(
      (user: ProfileModel) => {
        this.addUserForm.reset();
        this.clearResources();
        this.router.navigateByUrl(`${USERS_ROUTE}/${user['id']}`);
      },
      error => {
        console.error('Create user fail', error);
      }
    );
  }

  discardUser(): void {
    this.api.get(`/users/discarge/${this.user.id}`).subscribe(
      () => {
        this.router.navigateByUrl(`${USERS_ROUTE}`);
      },
      error => {
        console.error('Discharge user fail', error);
      }
    );
  }
}
