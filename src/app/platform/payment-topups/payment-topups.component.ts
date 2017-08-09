import { Component } from '@angular/core';
import { PaymentTopupsModel, PaymentTopupsPredicateObject } from '../../shared/models/payment-topups.model';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ApiService } from '../../shared/services/api.service';
import { paymentTopupsActions } from '../../shared/reducers/payment-topups.reducer';
import { StateModel } from '../../shared/models/state.model';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AppConfigService } from '../../shared/services/app-config.service';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileModel } from '../../shared/models/profile.model';
import { RoleService } from '../../shared/services/role.service';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { paymentTopupsStateActions } from '../../shared/reducers/payment-topups-state.reducer';
import { Moment } from 'moment';

const PAYMENT_TOPUPS_ROUTE = 'platform/payment-topups';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const FILTER_SECTIONS = ['DATE', 'BASIC', 'CARDGROUP'];
const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

@Component({
  selector: 'mss-payment-topups',
  templateUrl: './payment-topups.component.html',
  styleUrls: ['./payment-topups.component.scss']
})
export class PaymentTopupsComponent {

  private unsubscribe$ = new UnsubscribeSubject();

  paymentTopup: PaymentTopupsModel[] = [];
  loading: boolean;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;
  dateFormat = 'DD.MM.YYYY';

  topupsFilterSections = FILTER_SECTIONS;
  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;
  filterForm: FormGroup;
  stateOptions: SelectItem[] = [];
  issuerCodes: SelectItem[] = [];
  cardGroupCodes: SelectItem[] = [];

  constructor(private store: Store<AppStateModel>,
              private api: ApiService,
              private router: Router,
              private fb: FormBuilder,
              private roles: RoleService,
              private language: LanguageService,
              private route: ActivatedRoute,
              private configService: AppConfigService) {

    this.filterForm = this.fb.group({
      variableSymbol: [''],
      specificSymbol: [''],
      state: [''],
      issuerCode: [{value: '', disabled: true}],
      cardGroupCode: [{value: '', disabled: true}],
      createdFrom: [null],
      createdTo: [null]
    });

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.store.dispatch({type: paymentTopupsActions.TOPUPS_GET_REQUEST, payload: this.requestModel});
      }
    );

    this.store.dispatch({type: paymentTopupsStateActions.TOPUPS_STATE_GET_REQUEST});

    this.filterSections = this.topupsFilterSections.map(item => ({
      value: item,
      label: this.language.translate(`paymentTopups.filterSections.${item}`)
    }));
    this.visibleSection = this.filterSections[0];

    this.configService.get('dateFormat').subscribe(
      format => this.dateFormat = format
    );


    this.store.select('paymentTopups').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Pagination<PaymentTopupsModel>>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(`Error occurred while getting payment topups from api.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.paymentTopup = data.data.content;
          this.totalItems = data.data.totalElements;
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
        if (data.data && !data.loading) {
          const user = data.data;

          this.roles.isVisible('paymentTopups.issuerCodeSelect').subscribe(
            result => {
              if (result) {
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('paymentTopups.cardGroupCodeSelect').subscribe(
                  cardGroupResult => {
                    if (cardGroupResult) {
                      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: user.resourceId});
                    } else {
                      // remove this tab from view because there is nothing to display
                      this.filterSections = this.filterSections.filter(section => section.value !== 'CARDGROUP');
                    }
                  }
                );
              }
            }
          );
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
          this.issuerCodes = data.data.map(item => ({value: item.id, label: item.code}));
          this.enableFormItem('issuerCode');
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
          this.cardGroupCodes = data.data.map(item => ({value: item.id, label: item.code}));
          this.enableFormItem('cardGroupCode');
        }
      }
    );

    this.filterForm.get('issuerCode').valueChanges.subscribe(
      (id) => {
        this.cardGroupCodes = [];
        this.disableFormItem('cardGroupCode');
        if (id != null && id.length > 0) {
          this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: id});
        }
      }
    );

    this.store.select('paymentTopupsState').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving payment states.', data.error);
        }
        if (data.data != undefined && !data.loading) {
          this.stateOptions = data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.paymentsTypes.${item}`)
          }));
        }
      }
    );
  }

  enableFormItem(key: string): void {
    if (this.filterForm) {
      this.filterForm.get(key).enable();
    }
  }

  disableFormItem(key: string): void {
    this.filterForm.get(key).patchValue('');
    this.filterForm.get(key).disable();
  }

  clearFilter(): void {
    this.filterForm.reset();
    // disable only if issuerCodeSelect is visible
    if (this.issuerCodes.length > 0) {
      this.cardGroupCodes = [];
      this.disableFormItem('cardGroupCode');
    }
  }

  getPayments(): void {
    this.store.dispatch({type: paymentTopupsActions.TOPUPS_GET_REQUEST, payload: this.requestModel});
  }

  changeLimit(limit: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([PAYMENT_TOPUPS_ROUTE, routeParams]);
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${PAYMENT_TOPUPS_ROUTE}`, routeParams]);
  }

  get requestModel(): RequestOptions<PaymentTopupsPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: this.predicateObject
      },
      sort: {},
    };
  }

  private getDate(date: Moment): string {
    return date.format(DATE_FORMAT);
  }

  get predicateObject(): PaymentTopupsPredicateObject {
    const search = {
      ...this.filterForm.value,
      ...{createdTo: this.filterForm.value.createdTo ? this.getDate(this.filterForm.value.createdTo) : ''},
      ...{createdFrom: this.filterForm.value.createdFrom ? this.getDate(this.filterForm.value.createdFrom) : ''}
    };
    return Object.keys(search)
      .filter(key => search[key] != null && search[key].length > 0)
      .reduce(
        (acc, item) => {
          acc[item] = search[item];
          return acc;
        },
        {}
      );
  }

  getFormatedDate(date: Date | string): string {
    return moment(date).format(this.dateFormat);
  }

  onSelect(select: { selected: PaymentTopupsModel[] }): void {
    this.router.navigate([`${PAYMENT_TOPUPS_ROUTE}/${select.selected[0].uuid}`]);
  }

}
