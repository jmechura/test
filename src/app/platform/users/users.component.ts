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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      email: [null],
      login: [null],
      firstName: [null],
      lastName: [null],
      state: [null],
      merchantCode: [{value: null, disabled: true}],
      networkCode: [{value: null, disabled: true}],
      orgUnitCode: [{value: null, disabled: true}],
      issuerCode: [{value: null, disabled: true}],
      cardGroupCode: [{value: null, disabled: true}],
      terminalCode: [{value: null, disabled: true}],
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
      city: [null],
      email: [null, Validators.email],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      login: [null, Validators.required],
      password: [null, Validators.required],
      passwordAgain: [null, Validators.required],
      phone: [null],
      street: [null],
      zip: [null],
      template: [null, Validators.required],
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
          this.roles.isVisible('users.issuerCodeSelect').subscribe(
            issuerResult => {
              if (issuerResult) {
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('users.cardGroupCodeSelect').subscribe(
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

          this.roles.isVisible('users.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('users.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.store.dispatch({
                        type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST,
                        payload: this.profile.resourceAcquirerId
                      });
                    } else {

                      this.roles.isVisible('users.orgUnitCodeSelect').subscribe(
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

  private get predicateObject(): ProfilePredicateObject {
    return {
      ...this.filterForm.value
    };
  }

  selectCode(value: string, type: string): void {
    switch (type) {
      case 'ORG_UNIT':
        this.itemsForSelect['ORG_UNIT'] = [];
        if (value != null) {
          this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: value});
        }
        break;

      case 'MERCHANT':
        this.itemsForSelect['MERCHANT'] = [];
        this.itemsForSelect['ORG_UNIT'] = [];
        if (value != null) {
          this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: value});
        }
        break;

      case 'CARD_GROUP':
        this.itemsForSelect['CARD_GROUP'] = [];
        if (value != null) {
          this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: value});
        }
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

  goToCreateUser(): void {
    this.router.navigateByUrl(`${USERS_ROUTE}/create`);
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  discardUser(event: Event, id: string): void {
    this.api.get(`/users/discarge/${id}`).subscribe(
      () => {
        this.getUsers();
      },
      error => {
        console.error('Discharge user fail', error);
      }
    );
    event.stopPropagation();
  }
}
