import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { fillMerchant, MerchantModel, MerchantPredicateObject } from '../../shared/models/merchant.model';
import { StateModel } from '../../shared/models/state.model';
import { merchantsActions } from '../../shared/reducers/merchant.reducer';
import { ApiService } from '../../shared/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mss-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss'],
})
export class MerchantsComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  newMerchant: MerchantModel = fillMerchant();
  newMerchantModalShowing = false;
  newMerchantForm: FormGroup;

  loading = true;

  editedRow = -1;
  editedMerchant: MerchantModel = fillMerchant();

  merchantsRequest: RequestOptions<MerchantPredicateObject> = {
    pagination: {
      number: 10,
      numberOfPages: 0,
      start: 0,
    },
    search: {
      predicateObject: {},
    },
    sort: {}
  };

  tableData: Pagination<MerchantModel>;

  rows = [];

  constructor(fb: FormBuilder, private store: Store<AppState>, private api: ApiService) {

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

    this.getMerchantList();

    this.store.select('merchants').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<MerchantModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Merchant API call has returned error', error);
          return;
        }
        if (data != null) {
          this.tableData = data;
          this.rows = this.tableData.content.map(item => Object.assign({}, item));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  startEditing(row: any): void {
    if (this.editedRow === -1) {
      this.editedMerchant = Object.assign({}, this.tableData.content.find(item => item.id === row.id));
      this.editedRow = row.$$index;
    }
  }

  cancelEditing(): void {
    this.editedRow = -1;
  }

  submitEdit(): void {
    this.editedRow = -1;
    this.api.put('/merchants', this.editedMerchant).subscribe(
      () => {
        this.getMerchantList();
      },
      error => {
        console.error('Update merchant fail', error);
      }
    );
  }

  changeLimit(newLimit: number): void {
    if (this.merchantsRequest.pagination.number === newLimit) {
      return;
    }
    this.merchantsRequest.pagination.number = newLimit;
    this.getMerchantList();
  }

  get merchantState(): boolean {
    return this.editedMerchant.state === 'ENABLED';
  }

  set merchantState(newState: boolean) {
    this.editedMerchant.state = newState ? 'ENABLED' : 'DISABLED';
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
    this.store.dispatch({type: merchantsActions.MERCHANTS_API_GET, payload: this.merchantsRequest});
  }

  setPage(pageInfo: any): void {
    this.merchantsRequest.pagination.start = pageInfo.offset * this.merchantsRequest.pagination.number;
    this.getMerchantList();
  }

}
