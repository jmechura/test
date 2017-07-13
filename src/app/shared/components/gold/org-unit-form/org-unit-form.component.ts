import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../../models/app-state.model';
import { NetworkCodeState, networkCodeActions } from '../../../reducers/network-code.reducer';
import { SelectItem } from '../../bronze/select/select.component';
import { MerchantCodeState, merchantCodeActions } from '../../../reducers/merchant-code.reducer';
import { OrgUnitModel } from '../../../models/org-unit.model';
import { UnsubscribeSubject } from '../../../utils';

type OrgUnitFormVariant = 'create' | 'update';

@Component({
  selector: 'mss-org-unit-form',
  templateUrl: './org-unit-form.component.html',
  styleUrls: ['./org-unit-form.component.scss']
})
export class OrgUnitFormComponent implements OnDestroy {
  @Input() variant: OrgUnitFormVariant = 'create';
  @Output() modelSubmit = new EventEmitter<OrgUnitModel>();
  @Output() dismiss = new EventEmitter<void>();
  form: FormGroup;
  networkOptions: SelectItem[] = [];
  merchantOptions: SelectItem[] = [];
  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private store: Store<AppStateModel>, private fb: FormBuilder) {
    this.form = this.fb.group({
      city: '',
      code: ['', Validators.required],
      id: '',
      merchantId: [{value: '', disabled: true}, Validators.required],
      name: ['', Validators.required],
      note: '',
      networkCode: ['', Validators.required],
      region: '',
      state: 'ENABLED',
      street: '',
      zip: ''
    });

    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      (state: NetworkCodeState) => {
        if (state.error !== null) {
          console.error('Error getting network codes', state.error);
          return;
        }

        if (state.data) {
          this.networkOptions = state.data.map(network => ({value: network.id, label: network.code}));
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      (state: MerchantCodeState) => {
        if (state.error !== null) {
          console.error('Error getting merchant codes', state.error);
          return;
        }

        if (state.data) {
          this.form.get('merchantId').enable();
          this.merchantOptions = state.data.map(merchant => ({value: merchant.id, label: merchant.code}));
        }
      }
    );

    this.form.get('networkCode').valueChanges.takeUntil(this.unsubscribe$).subscribe(networkCode => {
      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: networkCode});
    });

    this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  @Input() set modelTemplate(model: OrgUnitModel) {
    if (model != null) {
      this.form.patchValue(model);
      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: model.networkCode});
    }
  }

  emitOrgUnit(): void {
    this.modelSubmit.emit(this.form.value);
  }

  emitDismiss(): void {
    this.dismiss.emit();
  }

  get formInvalid(): boolean {
    return this.form.invalid || this.form.get('merchantId').disabled;
  }
}
