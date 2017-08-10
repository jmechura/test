import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UnsubscribeSubject } from '../../shared/utils';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { paymentTopupsDetailActions } from '../../shared/reducers/payment-topups-detail.reducer';
import { PaymentTopupsModel } from '../../shared/models/payment-topups.model';
import { StateModel } from '../../shared/models/state.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { ApiService } from '../../shared/services/api.service';
import { LanguageService } from '../../shared/services/language.service';

const STATES = ['NEW', 'ALREADY_EXIST', 'NOT_FOUND'];
const API_ENDPOINT = '/payments/topups';

@Component({
  selector: 'mss-payment-topups-detail',
  templateUrl: './payment-topups-detail.component.html',
  styleUrls: ['./payment-topups-detail.component.scss']
})
export class PaymentTopupsDetailComponent {

  private unsubscribe$ = new UnsubscribeSubject();
  paymentTopup: PaymentTopupsModel;
  isEditing = false;

  paymentTopupsForm: FormGroup;

  stateOptions: SelectItem[] = [];

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private language: LanguageService,
              private api: ApiService,
              private fb: FormBuilder) {

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: Params) => {
        this.store.dispatch({type: paymentTopupsDetailActions.TOPUPS_DETAIL_GET_REQUEST, payload: params.id});
      }
    );

    this.paymentTopupsForm = this.fb.group({
      variableSymbol: [''],
      specificSymbol: [''],
      state: ['']
    });

    this.stateOptions = [
      {
        value: 'NEW',
        label: this.language.translate('enums.paymentsTypes.NEW')
      },
      {
        value: 'RETURN',
        label: this.language.translate('enums.paymentsTypes.RETURN')
      }
    ];

    this.store.select('paymentTopupsDetail').takeUntil(this.unsubscribe$).subscribe(
      ({data, loading, error}: StateModel<PaymentTopupsModel>) => {
        if (error) {
          console.error('Payment topups detail API call has returned error', error);
          return;
        }

        if (data != null && !loading) {
          this.paymentTopup = data;
          this.paymentTopupsForm.patchValue(this.paymentTopup);
        }
      }
    );
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  updatePaymentTopup(): void {
    this.store.dispatch({
      type: paymentTopupsDetailActions.TOPUPS_DETAIL_PUT_REQUEST,
      payload: {uuid: this.paymentTopup.uuid, ...this.paymentTopupsForm.value}
    });
    this.isEditing = false;
  }

  processPayment(): void {
    this.api.get(`${API_ENDPOINT}/process/${this.paymentTopup.uuid}`).subscribe(
      () => {
        this.store.dispatch({type: paymentTopupsDetailActions.TOPUPS_DETAIL_GET, payload: this.paymentTopup.uuid});
      },
      (error) => {
        console.error('Error occurred while processing payment', error);
      }
    );
  }

  get canEditState(): boolean {
    return this.paymentTopup && STATES.some(state => state === this.paymentTopup.state);
  }
}
