import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { Moment } from 'moment';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { transactionActions } from '../../shared/reducers/transactions.reducer';
import { StateModel } from '../../shared/models/state.model';
import { Transaction, TransactionPredicateObject } from '../../shared/models/transaction.model';
import { transactionCodesActions } from '../../shared/reducers/transaction-code.reducer';
import { transactionTypesActions } from '../../shared/reducers/transaction-type.reducer';
import { transactionStatesActions } from '../../shared/reducers/transaction-state.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { RoleService } from '../../shared/services/role.service';
import { ProfileModel } from '../../shared/models/profile.model';
import { AppConfigService } from '../../shared/services/app-config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmbededComponentModel } from '../../shared/models/embeded-component.model';

const TRANSACTIONS_FILTERS = ['DATE', 'LOCATION', 'PAYMENT', 'TRANSACTION'];
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';
const CODE_NAMES = ['issuerCode', 'cardGroupCode', 'networkCode', 'merchantCode', 'orgUnitCode'];

function setForm(form: FormGroup, key: string, value: string): void {
  form.get(key).patchValue(value);
  form.get(key).enable();
}

@Component({
  selector: 'mss-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
  /**
   * From select date
   * @type {moment.Moment}
   */
  fromDate: Moment = null;
  /**
   * To select date
   * @type {moment.Moment}
   */
  toDate: Moment = null;
  /**
   * Transaction type options
   * @type {Array}
   */
  types: SelectItem[] = [];
  /**
   * Transaction states options
   * @type {Array}
   */
  states: SelectItem[] = [];
  /**
   * Transaction loading
   * @type {boolean}
   */
  loading = false;

  /**
   * Holds currently displayed rows of table
   * @type {Array}
   */
  rows: any[] = [];
  /**
   * Unsubscribe subject
   * @type {Subject<void>}
   */
  private unsubscribe$ = new UnsubscribeSubject();

  /**
   * Selected tab
   * @type {string}
   */
  visibleFilter: SelectItem;
  /**
   * Card group codes for transactions
   * @type {[{value: string; label: string}]}
   */
  cardGroupCodes: SelectItem[] = [];
  /**
   * Issuers codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  issuerCodes: SelectItem[] = [];
  /**
   * Merchant codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  merchantCodes: SelectItem[] = [];
  /**
   * Network codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  networkCodes: SelectItem[] = [];
  /**
   * Org Unit codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  orgUnitCodes: SelectItem[] = [];
  /**
   * Holds table element for recalculate
   */
  @ViewChild('table') table: DatatableComponent;

  showLocationFilterTab = false;

  transactionTypeIcons: { [ key: string]: string };

  readonly transactionFilters = TRANSACTIONS_FILTERS;

  pageNumber = 0;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  totalItems = 0;
  sortOptions = {
    predicate: 'pk.termDttm',
    reverse: false
  };

  filterForm: FormGroup;
  embededObject: EmbededComponentModel;

  @Input()
  set embeded(obj: EmbededComponentModel) {
    this.embededObject = obj;
    Object.keys(obj).forEach(key => {
      switch (key) {
        case 'issuerId':
          this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: obj.issuerId});
          break;
        case 'networkId':
          this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: obj.networkId});
          break;
        case 'merchantId':
          this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: obj.merchantId});
          break;
        default:
          setForm(this.filterForm, key, obj[key]);
      }
    });
  }

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private language: LanguageService,
              private roles: RoleService,
              private fb: FormBuilder,
              private configService: AppConfigService) {

    this.visibleFilter = this.filterOptions[0];

    this.filterForm = this.fb.group({
      uuid: null,
      rrn: null,
      responseCode: null,
      transactionType: [{value: null, disabled: true}],
      state: [{value: null, disabled: true}],
      approvalCode: null,
      cardGroupCode: [{value: null, disabled: true}],
      cln: null,
      dstStan: null,
      issuerCode: [{value: null, disabled: true}],
      merchantCode: [{value: null, disabled: true}],
      networkCode: [{value: null, disabled: true}],
      orgUnitCode: [{value: null, disabled: true}],
      specificSymbol: null,
      terminalCode: null,
      vs: null,
      amount: null,
      termDttmFrom: null,
      termDttmTo: null
    });

    this.configService.get('transactionTypeIcons').subscribe(
      icons => this.transactionTypeIcons = icons
    );

    this.store.dispatch({type: transactionCodesActions.TRANSACTION_CODES_GET_REQUEST});
    this.store.dispatch({type: transactionTypesActions.TRANSACTION_TYPES_GET_REQUEST});
    this.store.dispatch({type: transactionStatesActions.TRANSACTION_STATES_GET_REQUEST});

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

          this.roles.isVisible('dashboard.issuerCodeSelect').subscribe(
            (issuerResult: boolean) => {
              if (issuerResult) {
                this.showLocationFilterTab = true;
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('dashboard.cardGroupCodeSelect').subscribe(
                  cardGroupResult => {
                    if (cardGroupResult) {
                      this.showLocationFilterTab = true;
                      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: user.resourceId});
                    }
                  }
                );
              }
            }
          );

          this.roles.isVisible('dashboard.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.showLocationFilterTab = true;
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('dashboard.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.showLocationFilterTab = true;
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    } else {

                      this.roles.isVisible('dashboard.orgUnitCodeSelect').subscribe(
                        orgUnitResult => {
                          if (orgUnitResult) {
                            this.showLocationFilterTab = true;
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

          this.roles.isVisible('admin.view').subscribe(
            (adminResult: boolean) => {
              this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
                (issuerData: StateModel<CodeModel[]>) => {
                  if (issuerData.error) {
                    console.error('Error while getting issuer codes', issuerData.error);
                    return;
                  }
                  if (issuerData.data != null && !issuerData.loading) {
                    this.issuerCodes = issuerData.data.map(item => ({
                      label: adminResult ? item.code : item.name,
                      value: `${item.id};${item.code}`
                    }));
                    if (this.issuerCodes.length > 0) {
                      this.filterForm.get('issuerCode').enable();
                    }
                  }
                }
              );

              this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
                (networkData: StateModel<CodeModel[]>) => {
                  if (networkData.error) {
                    console.error('Error while getting network codes', networkData.error);
                    return;
                  }
                  if (networkData.data != null && !networkData.loading) {
                    this.networkCodes = networkData.data.map(item => ({
                      label: adminResult ? item.code : item.name,
                      value: `${item.id};${item.code}`
                    }));
                    if (this.networkCodes.length > 0) {
                      this.filterForm.get('networkCode').enable();
                    }
                  }
                }
              );

              this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
                (merchantData: StateModel<CodeModel[]>) => {
                  if (merchantData.error) {
                    console.error('Error while getting merchant codes', merchantData.error);
                    return;
                  }
                  if (merchantData.data != null && !merchantData.loading) {
                    this.merchantCodes = merchantData.data.map(item => ({
                      label: adminResult ? item.code : item.name,
                      value: `${item.id};${item.code}`
                    }));
                    if (this.merchantCodes.length > 0) {
                      this.filterForm.get('merchantCode').enable();
                    }
                  }
                }
              );

              this.store.select('orgUnitCodes').takeUntil(this.unsubscribe$).subscribe(
                (orgUnitData: StateModel<CodeModel[]>) => {
                  if (orgUnitData.error) {
                    console.error('Error while getting org unit codes', orgUnitData.error);
                    return;
                  }
                  if (orgUnitData.data != null && !orgUnitData.loading) {
                    this.orgUnitCodes = orgUnitData.data.map(item => ({
                      label: adminResult ? item.code : item.name,
                      value: `${item.id};${item.code}`
                    }));
                    if (this.orgUnitCodes.length > 0) {
                      this.filterForm.get('orgUnitCode').enable();
                    }
                  }
                }
              );

              this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
                (cardGroupData: StateModel<CodeModel[]>) => {
                  if (cardGroupData.error) {
                    console.error('Error while getting card group codes', cardGroupData.error);
                    return;
                  }
                  if (cardGroupData.data != null && !cardGroupData.loading) {
                    this.cardGroupCodes = cardGroupData.data.map(item => ({
                      label: adminResult ? item.code : item.name,
                      value: `${item.id};${item.code}`
                    }));
                    if (this.cardGroupCodes.length > 0) {
                      this.filterForm.get('cardGroupCode').enable();
                    }
                  }
                }
              );
            }
          );
        }
      }
    );

    this.store.select('transactions').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Pagination<Transaction>>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error('Error while getting transactions.', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          // maps data to rows
          this.rows = data.data.content;
          this.totalItems = data.data.totalElements;
        }
      }
    );

    this.store.select('transactionTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error while getting transaction types', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.types = data.data.map(item => (
            {
              value: item,
              label: this.language.translate(`enums.transactionTypes.${item}`)
            }
          ));
          if (this.types.length > 0) {
            this.filterForm.get('transactionType').enable();
          }
        }
      }
    );

    this.store.select('transactionStates').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error while getting transaction states', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.states = data.data.map(item => (
            {
              value: item,
              label: this.language.translate(`enums.transactionStates.${item}`)
            }
          ));
          if (this.states.length > 0) {
            this.filterForm.get('state').enable();
          }
        }
      }
    );

  }

  get filterOptions(): SelectItem[] {
    if (this.showLocationFilterTab) {
      return TRANSACTIONS_FILTERS.map(item => ({
        label: this.language.translate(`transactions.list.filterSections.${item}`),
        value: item
      }));
    }
    return TRANSACTIONS_FILTERS
      .filter(item => item !== 'LOCATION')
      .map(item => ({
        label: this.language.translate(`transactions.list.filterSections.${item}`),
        value: item
      }));
  }


  /**
   * Redirects to the detail of selected item
   * @param type
   * @param value
   */
  goToDetail(type: string, value: any): void {
    if (type === 'uuid') {
      // TODO: go to detail
    }

    if (type === 'terminal') {
      // TODO: go to terminal
    }

    if (type === 'transaction') {
      this.router.navigateByUrl(`platform/transaction/${value.row.uuid}/${value.row.termDttm}`);
    }
  }

  /**
   * Changes max rows displayed in table
   * Changes pagination object and gets new set of data
   * @param limit
   */
  changeLimit(limit: number): void {
    if (this.rowLimit !== limit) {
      this.rowLimit = limit;
      this.getTransactions();
    }
  }

  /**
   * Sets current page of displayed data as offset in pagination object
   * Gets new data afterwards
   * @param pageInfo
   */
  setPage(pageInfo: any): void {
    if (this.pageNumber !== pageInfo.offset) {
      this.pageNumber = pageInfo.offset;
      this.getTransactions();
    }
  }

  /**
   * Removes empty properties from search object and then triggers action for getting transactions
   */
  getTransactions(): void {
    this.store.dispatch({
      type: transactionActions.TRANSACTIONS_GET_REQUEST,
      payload: this.requestModel
    });
  }

  /**
   * Clears all filters
   */
  clearFilter(): void {
    this.filterForm.reset();
    this.fromDate = null;
    this.toDate = null;
    this.merchantCodes = [];
    this.cardGroupCodes = [];
    this.orgUnitCodes = [];
  }

  selectIssuerCode(id: string): void {
    // clear it before new data arrives
    this.cardGroupCodes = [];
    this.disableItem('cardGroupCode');
    if (id != null) {
      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: id.split(';')[0]});
    }
  }

  disableItem(key: string): void {
    this.filterForm.get(key).reset();
    this.filterForm.get(key).disable();
  }

  /**
   * Selects network code and dispatches action to get valid merchant codes
   * @param id
   */
  selectNetworkCode(id: string): void {
    // clear it before new data arrives
    this.merchantCodes = [];
    this.orgUnitCodes = [];
    this.disableItem('merchantCode');
    this.disableItem('orgUnitCode');
    if (id != null) {
      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: id.split(';')[0]});
    }
  }

  /**
   * Select merchant code and dispatches action to get valid org unit codes
   * @param id
   */
  selectMerchantCode(id: string): void {
    // clear it before new data arrives
    this.orgUnitCodes = [];
    this.disableItem('orgUnitCode');
    if (id != null) {
      this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: id.split(';')[0]});
    }
  }

  getSortedTransactions(sortInfo: any): void {
    this.sortOptions = {
      predicate: (sortInfo.sorts[0].prop === 'termDttm') ? `pk.${sortInfo.sorts[0].prop}` : sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc'
    };

    this.getTransactions();
  }

  /**
   * Select icon from config, use default icon if undefined
   * @param {string} type
   * @returns {string}
   */
  getTransactionTypeIcon(type: string): string {
    let icon = this.transactionTypeIcons[type];
    if (icon == undefined) {
      icon = this.transactionTypeIcons['DEFAULT_ICON'];
    }
    return icon;
  }

  private get requestModel(): RequestOptions<TransactionPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: this.pageNumber * this.rowLimit
      },
      search: {
        predicateObject: this.predicateObject
      },
      sort: this.sortOptions
    };
  }

  private get predicateObject(): TransactionPredicateObject {
    return Object.keys(this.filterForm.value)
      .filter(key => this.filterForm.get(key).value != null && this.filterForm.get(key).value.length > 0)
      .reduce(
        (acc, item) => {
          if (item === 'termDttmFrom' || item === 'termDttmTo') {
            acc[item] = this.filterForm.get(item).value.format(DATE_FORMAT);
          } else {
            // is it resource code?
            if (CODE_NAMES.find(name => name === item)) {
              // code is in embeded object
              if (this.embededObject && this.embededObject[item]) {
                acc[item] = this.embededObject[item];
              } else {
                // code is in form, but on second position
                acc[item] = this.filterForm.get(item).value.split(';')[1];
              }
            } else {
              acc[item] = this.filterForm.get(item).value;
            }
          }
          return acc;
        },
        {}
      );
  };

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  ngOnInit(): void {
    this.getTransactions();
  }
}
