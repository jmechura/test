import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { StateModel } from '../../shared/models/state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TerminalModel, TerminalSearch } from '../../shared/models/terminal.model';
import { terminalActions } from '../../shared/reducers/terminal.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { ApiService } from '../../shared/services/api.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

const API_ENDPOINT = 'terminals';
const DEFAULT_FILTER: TerminalSearch = {
  code: '',
  name: '',
  networkCode: '',
  orgUnitId: null
};

@Component({
  selector: 'mss-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnDestroy {

  pagination: RequestOptions<TerminalSearch> = {
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

  private unsubscribe$ = new Subject<void>();

  newTerminalForm: FormGroup;
  terminalData: Pagination<TerminalModel>;
  networkCodes: SelectItem[];
  merchantCodes: SelectItem[];
  orgUnitCodes: SelectItem[];

  editModel: TerminalModel;
  editedRow: any;

  terminalRows: any[] = [];
  loading = false;
  modalShowing = false;

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppState>, private fb: FormBuilder, private api: ApiService) {
    this.store.dispatch({type: terminalActions.TERMINAL_GET_REQUEST, payload: this.pagination});
    this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});

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

    this.store.select('terminal').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<TerminalModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Terminal API call returned error', error);
          return;
        }

        if (data != undefined) {
          this.terminalData = data;
          this.terminalRows = data.content.map(item => ({
            id: item.id,
            code: item.code,
            name: item.name,
            coefficient: item.coefficient,
            address: this.getAddress(item),
            state: item.state
          }));
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
        }
      }
    );
  }

  getAddress(item: TerminalModel): string {
    let result = '';
    const valueUsed = (value): boolean => value !== null && value !== undefined && value !== '';

    if (valueUsed(item.street)) {
      result += `${item.street}`;
    }

    if (valueUsed(item.city)) {
      if (result.length > 0) {
        result += `, ${item.city}`;
      } else {
        result += `${item.city}`;
      }
    }

    if (valueUsed(item.zip)) {
      if (result.length > 0) {
        result += `, ${item.zip}`;
      } else {
        result += `${item.zip}`;
      }
    }
    return result;
  }

  get newFormInvalid(): boolean {
    return this.newTerminalForm.invalid || this.newTerminalForm.get('orgUnitId').disabled;
  }

  setPage(pageInfo: any): void {
    this.pagination.pagination.start = pageInfo.offset * this.pagination.pagination.number;
    this.store.dispatch({type: terminalActions.TERMINAL_GET_REQUEST, payload: this.pagination});
  }

  networkChanged(value: string | number): void {
    this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: value});
    this.newTerminalForm.get('merchantId').reset();
    this.newTerminalForm.get('orgUnitId').disable();
  }

  merchantChanged(value: string | number): void {
    this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: value});
    this.newTerminalForm.get('orgUnitId').reset();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  switchModal(): void {
    this.modalShowing = !this.modalShowing;
  }

  editSaveDisabled(): boolean {
    const oldModel = this.terminalData.content.find(item => item.id === this.editModel.id);
    return this.editModel.name === '' || Object.keys(this.editModel).every(key => this.editModel[key] === oldModel[key]);
  }

  addTerminal(): void {
    this.api.post(`${API_ENDPOINT}`, this.newTerminalForm.value).subscribe(
      () => {
        this.store.dispatch({type: terminalActions.TERMINAL_GET_REQUEST, payload: this.pagination});
      },
      (error) => {
        console.error('Terminal API call returned error.', error);
      }
    );
  }

  get editToggle(): boolean {
    return this.editModel.state === 'ENABLED';
  }

  set editToggle(value: boolean) {
    this.editModel.state = value ? 'ENABLED' : 'DISABLED';
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
}
