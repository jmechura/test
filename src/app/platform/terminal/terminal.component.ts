import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { StateModel } from '../../shared/models/state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TerminalModel, TerminalPredicateObject } from '../../shared/models/terminal.model';
import { terminalActions } from '../../shared/reducers/terminal.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const TERMINALS_ROUTE = 'platform/terminal';
const API_ENDPOINT = '/terminals';

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

  newTerminalForm: FormGroup;
  terminalData: Pagination<TerminalModel>;
  networkCodes: SelectItem[] = [];
  merchantCodes: SelectItem[] = [];
  orgUnitCodes: SelectItem[] = [];

  editModel: TerminalModel;
  editedRow: any;

  terminalRows: any[] = [];
  loading = false;
  modalShowing = false;

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
              private roles: RoleService) {
    this.getTerminalList();

    this.newTerminalForm = fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      networkCode: ['', Validators.required],
      orgUnitId: [{value: '', disabled: true}, Validators.required],
      city: '',
      coefficient: null,
      merchantId: {value: '', disabled: true},
      country: '',
      note: '',
      region: '',
      street: '',
      zip: '',
    });

    this.filterForm = fb.group({
        code: '',
        name: '',
        networkCode: '',
        merchantCode: {value: '', disabled: true},
        orgUnitCode: {value: '', disabled: true},
      }
    );

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

          this.roles.isVisible('filters.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('filters.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    } else {

                      this.roles.isVisible('filters.orgUnitCodeSelect').subscribe(
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
          this.merchantCodes = data.map(item => ({value: item.id, label: item.code}));
          this.newTerminalForm.get('merchantId').enable();
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
          this.orgUnitCodes = data.map(item => ({value: item.id, label: item.code}));
          this.newTerminalForm.get('orgUnitId').enable();
          this.filterForm.get('orgUnitCode').enable();
        }
      }
    );

    this.newTerminalForm.get('networkCode').valueChanges.takeUntil(this.unsubscribe$).subscribe(
      (value: string | number) => {
        if (value == null || value.toString().length === 0) {
          return;
        }
        this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: value});
        this.newTerminalForm.get('merchantId').reset();
        this.newTerminalForm.get('orgUnitId').disable();
      }
    );

    this.newTerminalForm.get('merchantId').valueChanges.takeUntil(this.unsubscribe$).subscribe(
      (value: string | number) => {
        if (value == null || value.toString().length === 0) {
          return;
        }
        this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: value});
        this.newTerminalForm.get('orgUnitId').reset();
      }
    );
  }

  get requestModel(): RequestOptions<TerminalPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: this.filterForm ? this.filterForm.value : {},
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  getSortedTerminals(sortInfo: any): void {
    this.sortOption = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getTerminalList();
  }

  get newFormInvalid(): boolean {
    return this.newTerminalForm.invalid || this.newTerminalForm.get('orgUnitId').disabled;
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

  switchModal(): void {
    this.modalShowing = !this.modalShowing;
  }

  addTerminal(): void {
    this.api.post(`${API_ENDPOINT}`, this.newTerminalForm.value).subscribe(
      () => {
        this.getTerminalList();
      },
      (error) => {
        console.error('Terminal API call returned error.', error);
      }
    );
  }

  editing(row: any): void {
    if (this.editedRow === row) {
      this.saveEditing();
      return;
    }
    if (this.editedRow) {
      this.table.rowDetail.toggleExpandRow(this.editedRow);
    }
    this.editedRow = row;
    this.editModel = Object.assign({}, this.terminalData.content.find(item => item.id === row.id));
    this.table.rowDetail.toggleExpandRow(row);
  }

  saveEditing(): void {
    this.store.dispatch({type: terminalActions.TERMINAL_PUT_REQUEST, payload: this.editModel});
    this.table.rowDetail.toggleExpandRow(this.editedRow);
    this.editedRow = null;
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
    this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: merchantCode});
  }
}
