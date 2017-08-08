import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { StateModel } from '../../shared/models/state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TerminalModel, TerminalPredicateObject } from '../../shared/models/terminal.model';
import { terminalActions } from '../../shared/reducers/terminal.reducer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { ApiService } from '../../shared/services/api.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { RoleService } from '../../shared/services/role.service';
import { ProfileModel } from '../../shared/models/profile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const TERMINALS_ROUTE = 'platform/terminal';

@Component({
  selector: 'mss-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;

  terminalData: Pagination<TerminalModel>;
  networkCodes: SelectItem[] = [];
  merchantCodes: SelectItem[] = [];
  orgUnitCodes: SelectItem[] = [];
  countries: SelectItem[] = [];

  terminalRows: any[] = [];
  loading = false;

  filterForm: FormGroup;

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private fb: FormBuilder,
              private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private roles: RoleService,
              private toastr: ExtendedToastrService) {

    this.filterForm = fb.group({
        code: '',
        name: '',
        networkCode: '',
        merchantCode: {value: '', disabled: true},
        orgUnitCode: {value: '', disabled: true},
      }
    );

    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getTerminalList();
      }
    );

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

          this.roles.isVisible('createEdit.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('createEdit.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    } else {

                      this.roles.isVisible('createEdit.orgUnitCodeSelect').subscribe(
                        orgUnitResult => {
                          if (orgUnitResult) {
                            this.store.dispatch({
                              type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST,
                              payload: user.resourceAcquirerId
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


    this.store.select('terminal').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<TerminalModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Terminal API call returned error', error);
          return;
        }

        if (data != undefined) {
          this.terminalData = data;
          this.terminalRows = data.content.map(item => item);
        }
      }
    );

    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Network code API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.networkCodes = data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Merchant code API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.merchantCodes = data.map(item => ({value: item.code + ';' + item.id, label: item.name}));
          this.filterForm.get('merchantCode').enable();
        }
      }
    );

    this.store.select('orgUnitCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('ORG Unit code API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.orgUnitCodes = data.map(item => ({value: item.code, label: item.code}));
          this.filterForm.get('orgUnitCode').enable();
        }
      }
    );

    this.store.select('countryCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting country codes from api.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.countries = data.data.map(country => ({value: country}));
        }
      }
    );
  }

  get requestModel(): RequestOptions<TerminalPredicateObject> {
    let filterFormValue = this.filterForm.get('merchantCode').value;
    if (filterFormValue && filterFormValue !== '') {
      filterFormValue = filterFormValue.split(';')[0];
    }
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: this.filterForm ? {...this.filterForm.value, merchantCode: filterFormValue} : {},
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  getSortedTerminals(sortInfo: any): void {
    this.sortOption = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getTerminalList();
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${TERMINALS_ROUTE}`, routeParams]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  changeLimit(limit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([TERMINALS_ROUTE, routeParams]);
  }

  onSelect(select: { selected: TerminalModel[] }): void {
    this.router.navigate([`${TERMINALS_ROUTE}/${select.selected[0].id}`]);
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  getTerminalList(): void {
    this.store.dispatch({type: terminalActions.TERMINAL_GET_REQUEST, payload: this.requestModel});
  }

  networkSelect(networkCode: string): void {
    this.filterForm.get('merchantCode').disable();
    this.filterForm.get('orgUnitCode').disable();
    this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: networkCode});
  }

  merchantSelect(merchantCode: string): void {
    this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: merchantCode.split(';')[1]});
  }
}
