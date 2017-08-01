import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { Store } from '@ngrx/store';
import { userListActions } from '../../shared/reducers/user-list.reducer';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ProfileModel, ProfilePredicateObject } from '../../shared/models/profile.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateSimpleModel } from '../../shared/models/template-simple.model';
import { ApiService } from '../../shared/services/api.service';
import { profileActions } from '../../shared/reducers/profile.reducer';
import { networkCodeActions } from 'app/shared/reducers/network-code.reducer';
import { templatesSimpleActions } from '../../shared/reducers/template-simple.reducer';
import { CodeModel } from 'app/shared/models/code.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { LanguageService } from '../../shared/services/language.service';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { AppConfigService } from '../../shared/services/app-config.service';
import { RoleService } from '../../shared/services/role.service';
import { MissingTokenResponse } from 'app/shared/utils';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';

const USERS_ROUTE = 'platform/users';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

const USER_FILTER_SECTIONS = ['BASIC', 'ISSUER', 'NETWORK'];

@Component({
  selector: 'mss-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnDestroy {

  loading = false;

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;
  tableRows: ProfileModel[];
  sortOption: {
    predicate: string;
    reverse: boolean;
  };
  users: ProfileModel[] = [];
  newUserModalShowing = false;
  newUserForm: FormGroup;
  filterForm: FormGroup;
  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;
  templates: TemplateSimpleModel[] = [];
  templatesOptions = [];
  profile: ProfileModel;
  itemsForSelect: { [key: string]: SelectItem[]; } = {};
  usersData: Pagination<ProfileModel>;
  userStates: SelectItem[];
  @ViewChild('table') table: DatatableComponent;
  private unsubscribe$ = new Subject<void>();

  userFilterSection = USER_FILTER_SECTIONS;

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private api: ApiService,
              private language: LanguageService,
              private appConfig: AppConfigService,
              private roles: RoleService) {

    this.filterForm = this.fb.group({
      email: [''],
      login: [''],
      firstName: [''],
      lastName: [''],
      state: [null],
      merchantCode: [{value: '', disabled: true}],
      networkCode: [{value: '', disabled: true}],
      orgUnitCode: [{value: '', disabled: true}],
      issuerCode: [{value: '', disabled: true}],
      cardGroupCode: [{value: '', disabled: true}],
      terminalCode: [{value: '', disabled: true}],
    });

    this.filterSections = USER_FILTER_SECTIONS.filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`users.list.sections.${item}`),
        value: item
      }));
    this.visibleSection = this.filterSections[0];

    this.appConfig.get('userStates').takeUntil(this.unsubscribe$).subscribe(
      data => {
        if (data !== undefined) {
          this.userStates = data.map(state => ({value: state}));
        }
      }
    );


    this.newUserForm = fb.group({
      city: [''],
      email: ['', Validators.email],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required],
      passwordAgain: ['', Validators.required],
      phone: [''],
      street: [''],
      zip: [''],
      template: ['', Validators.required],
      resources: fb.array([]),
    });

    this.store.select('userList').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<ProfileModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('User list API call returned error', error);
          return;
        }

        if (data != undefined) {
          this.usersData = data;
          this.tableRows = data.content.map(item => item) || [];
          this.totalItems = data.totalElements || 0;
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
          this.roles.isVisible('filters.issuerCodeSelect').subscribe(
            issuerResult => {
              if (issuerResult) {
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('filters.cardGroupCodeSelect').subscribe(
                  cardGroupResult => {
                    if (cardGroupResult) {
                      this.store.dispatch({
                        type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST,
                        payload: this.profile.resourceId
                      });
                    } else {
                      this.filterSections = this.filterSections.filter(item => item.value !== 'ISSUER');
                    }
                  }
                );
              }
            }
          );

          this.roles.isVisible('filters.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('filters.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.store.dispatch({
                        type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST,
                        payload: this.profile.resourceAcquirerId
                      });
                    } else {

                      this.roles.isVisible('filters.orgUnitCodeSelect').subscribe(
                        orgUnitResult => {
                          if (orgUnitResult) {
                            this.store.dispatch({
                              type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST,
                              payload: this.profile.resourceAcquirerId
                            });
                          } else {
                            this.filterSections = this.filterSections.filter(item => item.value !== 'NETWORK');
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

    this.store.dispatch({type: profileActions.PROFILE_GET_REQUEST});
    this.store.dispatch({type: templatesSimpleActions.TEMPLATES_SIMPLE_GET_REQUEST});

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getUsers();
      }
    );

    // Data for select boxes
    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting network codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.itemsForSelect['NETWORK'] = data.data.map(item => ({value: item.id, label: item.code}));
          if (this.itemsForSelect['NETWORK'].length !== 0) {
            this.filterForm.get('networkCode').enable();
          } else {
            this.filterForm.get('networkCode').disable();
            this.filterForm.get('merchantCode').disable();
            this.filterForm.get('orgUnitCode').disable();
          }
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
          if (this.itemsForSelect['MERCHANT'].length !== 0 && this.filterForm.get('networkCode').value) {
            this.filterForm.get('merchantCode').enable();
          } else {
            this.filterForm.get('merchantCode').disable();
            this.filterForm.get('orgUnitCode').disable();
          }
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
          if (this.itemsForSelect['ORG_UNIT'].length !== 0 && this.filterForm.get('merchantCode').value) {
            this.filterForm.get('orgUnitCode').enable();
          } else {
            this.filterForm.get('orgUnitCode').disable();
          }
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
          this.filterForm.get('cardGroupCode').enable();
        } else {
          this.filterForm.get('cardGroupCode').disable();
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
          this.filterForm.get('issuerCode').enable();
        } else {
          this.filterForm.get('issuerCode').disable();
          this.filterForm.get('issuerCode').disable();
        }
      }
    );
  }


  get requestModel(): RequestOptions<ProfilePredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: this.predicateObject
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  get isPasswordsEqual(): boolean {
    const passwordControl = this.newUserForm.get('password');
    const passwordAgainControl = this.newUserForm.get('passwordAgain');
    return passwordControl.value === passwordAgainControl.value;
  }

  get isValidEmail(): boolean {
    const emailControl = this.newUserForm.get('email');
    return !(emailControl.value !== '' && emailControl.errors !== null && emailControl.errors.email);
  }

  get resources(): FormArray {
    return this.newUserForm.get('resources') as FormArray;
  };

  private get predicateObject(): ProfilePredicateObject {
    return {
      ...this.filterForm.value
    };
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

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${USERS_ROUTE}`, routeParams]);
  }

  getUsers(): void {
    this.store.dispatch({type: userListActions.USER_LIST_GET_REQUEST, payload: this.requestModel});
  }

  onSelect(select: { selected: ProfileModel[] }): void {
    this.router.navigate([`${USERS_ROUTE}/${select.selected[0].id}`]);
  }

  changeLimit(limit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([`${USERS_ROUTE}`, routeParams]);
  }

  getSorted(sortInfo: any): void {
    this.sortOption = {
      predicate: sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc',
    };
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isPresent(value: string): boolean {
    const item = this.newUserForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  toggleNewUserModal(): void {
    this.newUserModalShowing = !this.newUserModalShowing;
  }

  addUser(): void {
    if (this.newUserForm.invalid) {
      // show some error messages maybe ?
      return;
    }

    const newUser = {
      ...this.newUserForm.value,
      template: {
        id: this.newUserForm.get('template').value,
        name: this.templates.filter(item => item.id === this.newUserForm.get('template').value)[0].name,
        resources: [...this.newUserForm.get('resources').value.map(item => ({
          id: item.id,
          resource: item.resource,
          resourceId: item.resourceId
        }))]
      }
    };
    delete newUser.passwordAgain;
    delete newUser.resources;
    this.api.post('/users', newUser).subscribe(
      () => {
        this.newUserForm.reset();
        this.clearResources();
        this.getUsers();
      },
      error => {
        console.error('Create user fail', error);
      }
    );
    this.toggleNewUserModal();
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
    this.newUserForm.setControl('resources', this.fb.array([]));
  }

  getTemplateResourcesOptionsByIndex(index: number): SelectItem[] {
    if (this.templates.filter(item => item.id === this.newUserForm.get('template').value)[0]) {
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
    if (this.templates.filter(item => item.id === this.newUserForm.get('template').value)[0]) {
      return this.templates.filter(item => item.id === this.newUserForm.get('template').value)[0].resources[index].resource;
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

  clearFilter(): void {
    this.filterForm.reset();
  }
}
