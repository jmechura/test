import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { fillMerchant, MerchantModel, MerchantPredicateObject } from '../../shared/models/merchant.model';
import { StateModel } from '../../shared/models/state.model';
import { merchantsActions } from '../../shared/reducers/merchant.reducer';
import { ApiService } from '../../shared/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../shared/components/bronze/select/select.component';

@Component({
  selector: 'mss-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: [
    './merchants.component.scss',
    '../../shared/components/silver/data-table/data-table.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MerchantsComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  merchants: MerchantModel[] = [];
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

  rowLimit = 10;
  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];

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

    this.store.dispatch({type: merchantsActions.MERCHANTS_API_GET, payload: this.merchantsRequest});

    this.store.select('merchants').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<MerchantModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Merchant API call has returned error', error);
          return;
        }
        if (data != null) {
          this.merchants = data.content;
          this.rows = this.merchants.map(item => Object.assign({}, item));
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
        this.store.dispatch({type: merchantsActions.MERCHANTS_API_GET, payload: this.merchantsRequest});
      },
      error => {
        console.error('Create merchant fail', error);
      }
    );
    this.toggleNewMerchantModal();
  }

  startEditing(row: any): void {
    if (this.editedRow === -1) {
      this.editedMerchant = Object.assign({}, this.merchants.find(item => item.id === row.id));
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
        this.store.dispatch({type: merchantsActions.MERCHANTS_API_GET, payload: this.merchantsRequest});
      },
      error => {
        console.error('Update merchant fail', error);
      }
    );
  }

  changeLimit(newLimit: number): void {
    this.rowLimit = newLimit;
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

}
