import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { MerchantModel, MerchantPredicateObject } from '../../shared/models/merchant.model';
import { StateModel } from '../../shared/models/state.model';
import { merchantsActions } from '../../shared/reducers/merchant.reducer';
import { ApiService } from '../../shared/services/api.service';
import { FormBuilder } from '@angular/forms';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeModel } from '../../shared/models/code.model';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { RoleService } from '../../shared/services/role.service';
import { ProfileModel } from '../../shared/models/profile.model';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { LanguageService } from '../../shared/services/language.service';
import { MerchantsFilterSections } from '../../shared/enums/merchants-filter-sections.enum';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

const MERCHANT_ROUTE = 'platform/merchants';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss'],
})
export class MerchantsComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();

  networkCodes: SelectItem[] = [];
  merchantCodes: SelectItem[] = [];
  countries: SelectItem[] = [];

  stateOptions: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];

  name: string;
  ico: string;
  dic: string;
  city: string;
  zip: string;
  networkCode: string;
  merchantCode: string;

  loading = true;

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  merchantsFilterSections = MerchantsFilterSections;
  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;

  tableData: Pagination<MerchantModel>;
  rows: MerchantModel[] = [];

  showNetworkTab = false;

  constructor(private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private api: ApiService,
              private language: LanguageService,
              private router: Router,
              private route: ActivatedRoute,
              private roles: RoleService,
              private toastr: ExtendedToastrService) {

    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getMerchantList();
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

          this.roles.isVisible('merchants.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.showNetworkTab = true;
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('merchants.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.showNetworkTab = true;
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    }
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
          this.merchantCodes = data.data.map(item => ({value: item.code}));
        }
      }
    );

    this.store.select('merchants').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<MerchantModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Merchant API call has returned error', error);
          return;
        }
        if (data != null) {
          this.tableData = data;
          this.rows = this.tableData.content.map(item => item);
        }
      }
    );

    this.filterSections = Object.keys(MerchantsFilterSections).filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`merchants.detail.${item}`),
        value: MerchantsFilterSections[item]
      }));
    this.visibleSection = this.filterSections[0];
  }

  get requestModel(): RequestOptions<MerchantPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: {
          name: this.name || '',
          ico: this.ico || '',
          dic: this.dic || '',
          city: this.city || '',
          zip: this.zip || '',
          networkCode: this.networkCode || '',
          merchantCode: this.merchantCode || '',
        }
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  redirectToMerchantCreation(): void {
    this.router.navigateByUrl('/platform/merchants/create');
  }

  changeLimit(limit: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([MERCHANT_ROUTE, routeParams]);
  }

  getMerchantList(): void {
    this.store.dispatch({type: merchantsActions.MERCHANTS_API_GET, payload: this.requestModel});
  }

  getSortedMerchants(sortInfo: any): void {
    this.sortOption = {
      predicate: sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc'
    };
    this.getMerchantList();
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${MERCHANT_ROUTE}`, routeParams]);
  }

  selectNetworkCode(id: string): void {
    this.networkCode = id;
    // clear it before new data arrives
    this.merchantCodes = [];
    if (id != null) {
      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: id});
    }
  }

  clearFilter(): void {
    this.name = null;
    this.ico = null;
    this.dic = null;
    this.city = null;
    this.zip = null;
    this.networkCode = null;
    this.merchantCode = null;
  }

  onSelect(select: { selected: MerchantModel[] }): void {
    this.router.navigate([`${MERCHANT_ROUTE}/${select.selected[0].id}`]);
  }
}
