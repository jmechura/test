import { Component, OnDestroy, ViewChild } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { Moment } from 'moment';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { transactionActions } from '../../shared/reducers/transaction.reducer';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { Transaction, TransactionSearch } from '../../shared/models/transaction.model';
import { transactionCodesActions } from '../../shared/reducers/transactionCode.reducer';
import { transactionTypesActions } from '../../shared/reducers/transactionType.reducer';
import { transactionStatesActions } from '../../shared/reducers/transactionState.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';

const ALL = '';
const DEFAULT_FILTER: TransactionSearch = {
  uuid: '',
  rrn: '',
  responseCode: '',
  transactionType: '',
  state: '',
  approvalCode: '',
  cardGroupCode: '',
  cln: '',
  dstStan: null,
  issuerCode: '',
  merchantCode: '',
  networkCode: '',
  orgUnitCode: '',
  specificSymbol: '',
  terminalCode: '',
  vs: '',
  amount: null
};
const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

@Component({
  selector: 'mss-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {

  /**
   * Pagination count select options
   * @type {[{value: number},{value: number},{value: number},{value: number}]}
   */
  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
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
   * Transaction code options
   * @type {Array}
   */
  codes: SelectItem[] = [];
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
   * Stored transaction data with pagination information
   */
  tableData: Pagination<Transaction>;

  /**
   * Pagination and search object for requests, pagination is also used for setting table pagination
   * @type {{pagination: {number: number; numberOfPages: number; start: number};
   * search: {predicateObject: ({}&TransactionSearch)}; sort: {}}}
   */
  pagination: RequestOptions<TransactionSearch> = {
    pagination: {
      number: 10,
      numberOfPages: 0,
      start: 0,
    },
    search: {
      predicateObject: Object.assign({}, DEFAULT_FILTER)
    },
    sort: {}
  };
  /**
   * Holds columns names
   * @type {{name: string}[]}
   */
  columns = [
    {name: 'UUID'},
    {name: 'Terminal Date'},
    {name: 'Terminal ID'},
    {name: 'Amount'},
    {name: 'State'},
    {name: 'Approval Code'},
    {name: 'Response Code'},
    {name: 'Transaction Type'},
    {name: 'Merchant Code'},
    {name: 'DST Stan'},
    {name: 'RRN'},
    {name: 'Variable Symbol'},
  ];
  /**
   * Holds currently displayed rows of table
   * @type {Array}
   */
  rows: any[] = [];
  /**
   * Unsubscribe subject
   * @type {Subject<void>}
   */
  private unsubscribe = new Subject<void>();
  /**
   * Filter transaction options
   * @type {string[]}
   */
  filterOptions = ['datum', 'umístění', 'platba', 'transakce'];
  /**
   * Selected tab
   * @type {string}
   */
  visibleFilter = this.filterOptions[0];
  /**
   * Approval codes for transactions
   * @type {SelectItem[]}
   */
  approvalCodes: SelectItem[] = [{value: ALL, label: 'Approval codes'}];
  /**
   * Card group codes for transactions
   * @type {[{value: string; label: string}]}
   */
  cardGroupCodes: SelectItem[] = [{value: ALL, label: 'Card group codes'}];
  /**
   * CLNs for transaction filter
   * @type {[{value: string; label: string}]}
   */
  cln: SelectItem[] = [{value: ALL, label: 'CLN'}];
  /**
   * Issuers codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  issuerCodes: SelectItem[] = [{value: ALL, label: 'Issuers code'}];
  /**
   * Merchant codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  merchantCodes: SelectItem[] = [{value: ALL, label: 'Merchant codes'}];
  /**
   * Network codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  networkCodes: SelectItem[] = [{value: ALL, label: 'Network codes'}];
  /**
   * Org Unit codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  orgUnitCodes: SelectItem[] = [{value: ALL, label: 'Org Unit Codes'}];
  /**
   * Terminal codes for transaction filter
   * @type {[{value: string; label: string}]}
   */
  terminalCodes: SelectItem[] = [{value: ALL, label: 'Terminal codes'}];
  /**
   * Holds table element for recalculate
   */
  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppState>, private router: Router) {
    this.store.dispatch({type: transactionCodesActions.CODES_GET});
    this.store.dispatch({type: transactionTypesActions.TYPES_GET});
    this.store.dispatch({type: transactionStatesActions.STATES_GET});
    this.store.select('transactions').takeUntil(this.unsubscribe).subscribe(
      (data: StateModel<Pagination<Transaction>>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error('Error while getting transactions.', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          // maps data to rows
          this.tableData = data.data;
          this.rows = this.tableData.content.map(item => (
            {
              'uuid': item.uuid,
              'terminal date': item.termDttm,
              'terminal id': item.terminalCode,
              'amount': item.amount,
              'state': item.state,
              'approval code': item.approvalCode,
              'response code': item.responseCode,
              'transaction type': item.transactionType,
              'merchant code': item.merchantCode,
              'dst stan': item.dstStan,
              'rrn': item.rrn,
              'variable symbol': item.vs,
            }
          ));
          // has to be called to set valid grid when number of rows is changed
          setTimeout(
            () => {
              this.table.recalculate();
            },
            0
          );
        }
      }
    );

    this.store.select('transactionCodes').takeUntil(this.unsubscribe).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error while getting transaction codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.codes = data.data.map(item => (
            {
              value: item
            }
          ));
        }
      }
    );

    this.store.select('transactionTypes').takeUntil(this.unsubscribe).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error while getting transaction types', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.types = data.data.map(item => (
            {
              value: item
            }
          ));
        }
      }
    );

    this.store.select('transactionStates').takeUntil(this.unsubscribe).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error while getting transaction states', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.states = data.data.map(item => (
            {
              value: item
            }
          ));
        }
      }
    );
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
      this.router.navigateByUrl(`platform/transaction/${value.row.uuid}`);
    }
  }

  /**
   * Changes max rows displayed in table
   * Changes pagination object and gets new set of data
   * @param limit
   */
  changeLimit(limit: number): void {
    if (this.pagination.pagination.number === limit) {
      return;
    }
    this.pagination.pagination.number = limit;
    this.store.dispatch({type: transactionActions.TRANSACTION_GET, payload: this.pagination});
  }

  /**
   * Sets current page of displayed data as offset in pagination object
   * Gets new data afterwards
   * @param pageInfo
   */
  setPage(pageInfo: any): void {
    this.pagination.pagination.start = pageInfo.offset * this.pagination.pagination.number;
    this.store.dispatch({type: transactionActions.TRANSACTION_GET, payload: this.pagination});
  }

  /**
   * Sets transaction from date for filtering
   * @param date
   */
  changeFromDate(date: Moment): void {
    this.fromDate = date;
    this.pagination.search.predicateObject.termDttmFrom = date.format(DATE_FORMAT);
  }

  /**
   * Sets transaction to date for filtering
   * @param date
   */
  changeToDate(date: Moment): void {
    this.toDate = date;
    this.pagination.search.predicateObject.termDttmTo = date.format(DATE_FORMAT);
  }

  /**
   * Removes empty properties from search object and then triggers action for getting transactions
   */
  getTransactions(): void {
    const search = Object.keys(this.pagination.search.predicateObject)
      .filter(key => this.pagination.search.predicateObject[key] != null && this.pagination.search.predicateObject[key].length > 0)
      .reduce(
        (acc, item) => {
          acc[item] = this.pagination.search.predicateObject[item];
          return acc;
        },
        {}
      );
    this.store.dispatch({
      type: transactionActions.TRANSACTION_GET,
      payload: Object.assign(this.pagination, {search: {predicateObject: search}})
    });
  }

  /**
   * Clears all filters
   */
  clearFilter(): void {
    this.pagination.search.predicateObject = Object.assign({}, DEFAULT_FILTER);
    this.fromDate = null;
    this.toDate = null;
  }


  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
