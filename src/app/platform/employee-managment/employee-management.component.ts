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
import { AccountPredicateObject, ProfileModel } from '../../shared/models/profile.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateSimpleModel } from '../../shared/models/template-simple.model';
import { ApiService } from '../../shared/services/api.service';
import { profileActions } from '../../shared/reducers/profile.reducer';
import { networkCodeActions } from 'app/shared/reducers/network-code.reducer';
import { templatesSimpleActions } from '../../shared/reducers/template-simple.reducer';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { CodeModel } from 'app/shared/models/code.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';

const EMPLOYEES_ROUTE = 'platform/employees';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

const DEFAULT_FILTER = {
  cardGroupCode: '',
  cln: '',
  email: '',
  firstName: '',
  issuerCode: '',
  langKey: '',
  lastName: '',
  login: '',
  merchantCode: '',
  networkCode: '',
  orgUnitCode: '',
  terminalCode: ''
};

@Component({
  selector: 'mss-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnDestroy {

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
  templates: TemplateSimpleModel[] = [];
  templatesOptions = [];
  profile: ProfileModel;
  itemsForSelect: { [key: string]: SelectItem[]; } = {};

  private unsubscribe$ = new Subject<void>();
  usersData: Pagination<ProfileModel>;

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private api: ApiService) {

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
      resources: fb.array([
      ]),
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
          console.error('Account API call has returned error', error);
          return;
        }
        if (data != null) {
          this.profile = data;
        }
      }
    );

    this.store.dispatch({type: profileActions.PROFILE_GET_REQUEST});
    this.store.dispatch({type: templatesSimpleActions.TEMPLATES_SIMPLE_GET_REQUEST});
    this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
    this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});

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
          this.itemsForSelect['NETWORK'] = data.data.map(item => ({label: item.code, value: item.id}));
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
    this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting issuer codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.itemsForSelect['CARD_GROUP'] = data.data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );
  }

  get requestModel(): RequestOptions<AccountPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: Object.assign({}, DEFAULT_FILTER)
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${EMPLOYEES_ROUTE}`, routeParams]);
  }

  getUsers(): void {
    this.store.dispatch({type: userListActions.USER_LIST_GET_REQUEST, payload: this.requestModel});
  }

  onSelect(select: { selected: ProfileModel[] }): void {
    this.router.navigate([`${EMPLOYEES_ROUTE}/${select.selected[0].id}`]);
  }

  changeLimit(limit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([`${EMPLOYEES_ROUTE}`, routeParams]);
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

    const newUser = {...this.newUserForm.value,
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
    if (this.templates.filter(item => item.id === value)[0]) {
      this.clearResources();
      for (const res of this.templates.filter(item => item.id === value)[0].resources) {
        this.addResource(res.resource, res.id);
      }
    }
  }

  onChangeCode(value: number, index: number): void {
    const type = this.getResourceLabel(index);
    if (type === 'CARD_GROUP') {
      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: value});
    } else if (type === 'MERCHANT') {
      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: value});
    }
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
}
