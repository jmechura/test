import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../../models/app-state.model';
import { networkCodeActions, NetworkCodeState } from '../../../reducers/network-code.reducer';
import { SelectItem } from '../../bronze/select/select.component';
import { merchantCodeActions, MerchantCodeState } from '../../../reducers/merchant-code.reducer';
import { OrgUnitModel } from '../../../models/org-unit.model';
import { MissingTokenResponse, UnsubscribeSubject } from '../../../utils';
import { RoleService } from '../../../services/role.service';
import { ProfileModel } from '../../../models/profile.model';
import { StateModel } from '../../../models/state.model';

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
  @Input() completeView = true;

  constructor(private store: Store<AppStateModel>, private fb: FormBuilder, private roles: RoleService) {
    this.form = this.fb.group({
      city: '',
      code: ['', Validators.required],
      id: '',
      merchantId: ['', Validators.required],
      name: ['', Validators.required],
      note: '',
      networkCode: ['', Validators.required],
      region: '',
      state: 'ENABLED',
      street: '',
      zip: ''
    });

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<ProfileModel>) => {
        if (error) {
          if (error instanceof MissingTokenResponse) {
            return;
          }
          console.error('Profile API call has returned error', error);
          return;
        }

        if (data != null && !loading) {
          const user = data;
          this.roles.isVisible('orgUnits.formNetworkSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
                this.form.get('networkCode').valueChanges.takeUntil(this.unsubscribe$).subscribe(networkCode => {
                  this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: networkCode});
                });
              } else {
                this.form.patchValue({networkCode: user.networkCode});
                this.roles.isVisible('orgUnits.formMerchantSelect').subscribe(
                  merchantResult => {
                    if (merchantResult) {
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    } else {
                      this.form.patchValue({merchantId: user.resourceAcquirerId});
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  @Input()
  set modelTemplate(model: OrgUnitModel) {
    if (model != null) {
      this.form.patchValue(model);
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
