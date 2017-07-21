import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { fillMerchant, MerchantModel, MerchantPredicateObject } from '../../shared/models/merchant.model';
import { StateModel } from '../../shared/models/state.model';
import { merchantsActions } from '../../shared/reducers/merchant.reducer';
import { ApiService } from '../../shared/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeModel } from '../../shared/models/code.model';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { RoleService } from '../../shared/services/role.service';
import { ProfileModel } from '../../shared/models/profile.model';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';

const MERCHANT_ROUTE = 'platform/merchants';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss'],
})
export class MerchantsComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();

  newMerchant: MerchantModel = fillMerchant();
  newMerchantModalShowing = false;
  newMerchantForm: FormGroup;


  networkCodes: SelectItem[] = [];
  merchantCodes: SelectItem[] = [];

  code: string;
  name: string;
  networkCode: string;

  loading = true;

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  tableData: Pagination<MerchantModel>;
  rows: MerchantModel[] = [];

  constructor(private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private roles: RoleService) {

    this.newMerchantForm = fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      country: [''],
      region: [''],
      city: [''],
      zip: [''],
      street: [''],
      email: ['', control => control.value === '' ? null : Validators.email(control)],
      phone: [''],
      bankAccount: [''],
      ico: [''],
      dic: [''],
      note: [''],
    });

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getMerchantList();
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

          this.roles.isVisible('filters.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('filters.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
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
          code: this.code || '',
          name: this.name || '',
          networkCode: this.networkCode || '',
          networkName: '',
        }
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  toggleNewMerchantModal(): void {
    this.newMerchantModalShowing = !this.newMerchantModalShowing;
  }

  addMerchant(): void {
    if (this.newMerchantForm.invalid) {
      // show some error messages maybe ?
      return;
    }
    for (const key in this.newMerchant) {
      if (this.newMerchant[key] === '') {
        delete this.newMerchant[key];
      }
    }
    this.newMerchant.id = `${this.newMerchant.networkCode}:${this.newMerchant.code}`;

    this.api.post('/merchants', this.newMerchant).subscribe(
      () => {
        this.getMerchantList();
      },
      error => {
        console.error('Create merchant fail', error);
      }
    );
    this.toggleNewMerchantModal();
  }

  // submitEdit(): void {
  //   this.editedRow = -1;
  //   this.api.put('/merchants', this.editedMerchant).subscribe(
  //     () => {
  //       this.getMerchantList();
  //     },
  //     error => {
  //       console.error('Update merchant fail', error);
  //     }
  //   );
  // }

  changeLimit(limit: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([MERCHANT_ROUTE, routeParams]);
  }

  isPresent(value: string): boolean {
    const item = this.newMerchantForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  isValidEmail(value: string): boolean {
    const item = this.newMerchantForm.get(value);
    return item.touched && item.value !== '' && item.errors != null;
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
    this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: id});
  }

  clearFilter(): void {
    this.code = '';
    this.name = '';
    this.networkCode = '';
  }

}
