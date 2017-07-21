import { Component, OnDestroy } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { orgUnitListActions, OrgUnitListState } from '../../shared/reducers/org-unit-list.reducer';
import { OrgUnitModel, OrgUnitPredicateObject } from '../../shared/models/org-unit.model';
import { ApiService } from '../../shared/services/api.service';
import { RequestOptions } from '../../shared/models/pagination.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { OrgUnitFilterSections } from '../../shared/enums/org-unit-filter-section.enum';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StateModel } from '../../shared/models/state.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { RoleService } from '../../shared/services/role.service';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { CodeModel } from '../../shared/models/code.model';

const ORG_UNIT_ENDPOINT = '/orgUnits';
const ORG_UNIT_ROUTE = '/platform/org-units';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-org-unit-list',
  templateUrl: './org-unit-list.component.html',
  styleUrls: ['./org-unit-list.component.scss']
})
export class OrgUnitListComponent implements OnDestroy {
  pageNumber = 1;
  totalItems = 0;
  itemLimit = ITEM_LIMIT_OPTIONS[0];
  sortOption: {
    reverse: boolean;
    predicate: string
  };
  // other
  tableRows: OrgUnitModel[] = [];
  createModalShown = false;
  deleteModalShown = false;
  private selectedOrgUnitId: string;
  private unsubscribe$ = new UnsubscribeSubject();

  filterOptions: SelectItem[] = [];
  visibleFilter: SelectItem;
  OrgUnitFilterSections = OrgUnitFilterSections;
  networkCodes: SelectItem[] = [];
  merchantCodes: SelectItem[] = [];

  filterForm: FormGroup;

  constructor(private store: Store<AppStateModel>,
              private api: ApiService,
              private language: LanguageService,
              private router: Router,
              private fb: FormBuilder,
              private roles: RoleService,
              private route: ActivatedRoute) {
    this.store.select('orgUnitList').takeUntil(this.unsubscribe$).subscribe(
      (state: OrgUnitListState) => {
        if (state.error !== null) {
          console.error('Error getting org units', state.error);
          return;
        }

        if (state.data) {
          this.tableRows = state.data.content.map(item => item);
          this.totalItems = state.data.totalElements;
        }
      }
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.itemLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
      }
    );

    this.filterForm = this.fb.group({
      code: [''],
      merchantId: [{value: '', disabled: true}],
      merchantName: [''],
      name: [''],
      networkCode: [{value: '', disabled: true}],
      networkName: ['']
    });

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<ProfileModel>) => {
        if (data.error) {
          if (data.error instanceof MissingTokenResponse) {
            return;
          }
          console.error('Profile API call has returned error', data.error);
          return;
        }
        if (data.data && !data.loading /*because pn would be sad*/) {
          const user = data.data;

          this.roles.isVisible('filters.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('filters.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                      this.filterOptions = Object.keys(OrgUnitFilterSections).filter(key => isNaN(Number(key)))
                        .map(item => ({
                          label: this.language.translate(`orgUnits.list.sections.${item}`),
                          value: OrgUnitFilterSections[item]
                        }));
                    } else {
                      this.filterOptions = [
                        {
                          label: this.language.translate(`orgUnits.list.sections.${OrgUnitFilterSections[OrgUnitFilterSections.BASIC]}`),
                          value: OrgUnitFilterSections.BASIC
                        }
                      ];
                    }
                    this.visibleFilter = this.filterOptions[0];
                  }
                );
              }
            }
          );
        }
      }
    );

    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting network codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.networkCodes = data.data.map(item => ({label: item.code, value: item.id}));
          this.filterForm.get('networkCode').enable();
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting merchant codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.merchantCodes = data.data.map(item => ({value: item.id}));
          this.filterForm.get('merchantId').enable();
        }
      }
    );

    this.filterForm.get('networkCode').valueChanges.subscribe(
      (code: string) => {
        if (code && code.length > 0) {
          this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: code});
          this.merchantCodes = [];
          this.filterForm.get('merchantId').patchValue('');
          this.filterForm.get('merchantId').disable();
        }
      }
    );
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  itemsPerPage(itemLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(itemLimit)
    };
    this.router.navigate([`${ORG_UNIT_ROUTE}`, routeParams]);
  }

  showCreateModal(): void {
    this.createModalShown = true;
  }

  hideCreateModal(): void {
    this.createModalShown = false;
  }

  createOrgUnit(model: OrgUnitModel): void {
    this.api.post(ORG_UNIT_ENDPOINT, model).subscribe(
      () => {
        this.store.dispatch({type: orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST, payload: this.requestModel});
        this.createModalShown = false;
      },
      error => {
        console.error('Error creating org unit', error);
      }
    );
  }

  showDeleteModal(orgUnitId: string): void {
    this.selectedOrgUnitId = orgUnitId;
    this.deleteModalShown = true;
  }

  hideDeleteModal(): void {
    this.deleteModalShown = false;
  }

  deleteOrgUnit(): void {
    this.api.remove(`${ORG_UNIT_ENDPOINT}/${this.selectedOrgUnitId}`).subscribe(
      () => {
        this.store.dispatch({type: orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST, payload: this.requestModel});
        this.deleteModalShown = false;
      },
      error => {
        console.error('Error deleting org unit', error);
      }
    );
  }

  getDetailLink(orgUnitId: string): string {
    return `${ORG_UNIT_ROUTE}/${orgUnitId}`;
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.itemLimit)
    };
    this.router.navigate([`${ORG_UNIT_ROUTE}`, routeParams]);
  }

  getOrgUnits(): void {
    this.store.dispatch({type: orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST, payload: this.requestModel});
  }

  getSortedOrgUnits(sortInfo: any): void {
    this.sortOption = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getOrgUnits();

  }

  private get requestModel(): RequestOptions<OrgUnitPredicateObject> {
    return {
      pagination: {
        number: this.itemLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.itemLimit
      },
      search: this.filterForm.value,
      sort: this.sortOption ? this.sortOption : {}
    };
  }
}
