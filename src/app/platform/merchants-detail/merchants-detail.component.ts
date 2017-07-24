import { Component, OnDestroy } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { UnsubscribeSubject } from '../../shared/utils';
import { MerchantModel } from '../../shared/models/merchant.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { AppStateModel } from '../../shared/models/app-state.model';
import { LanguageService } from '../../shared/services/language.service';
import { merchantDetailActions } from '../../shared/reducers/merchant-detail.reducer';
import { StateModel } from '../../shared/models/state.model';

interface InfoModel {
  label: string;
  value: any;
  formName?: string;
  options?: SelectItem[];
}

@Component({
  selector: 'mss-merchants-detail',
  templateUrl: './merchants-detail.component.html',
  styleUrls: ['./merchants-detail.component.scss']
})
export class MerchantsDetailComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  merchant: MerchantModel;

  editing = false;

  merchantForm: FormGroup;

  detailOptions: SelectItem[] = [
    {value: 'Basic', label: this.langService.translate('merchants.detail.BASIC')},
    {value: 'Contact', label: this.langService.translate('merchants.detail.contact')},
    {value: 'Address', label: this.langService.translate('basic.address')},
  ];
  selectedOption = this.detailOptions[0];

  basicInfo: InfoModel[][];
  contactInfo: InfoModel[][];
  addressInfo: InfoModel[][];

  stateSelect: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private fb: FormBuilder) {

    this.merchantForm = this.fb.group(
      {
        name: ['', Validators.required],
        code: ['', Validators.required],
        id: ['', Validators.required],
        state: '',
        ico: '',
        dic: '',
        email: '',
        phone: '',
        bankAccount: '',
        street: '',
        city: '',
        zip: '',
        region: '',
        country: '',
      }
    );

    this.route.params.subscribe(
      (params: { id: string }) => {
        this.store.dispatch({type: merchantDetailActions.MERCHANT_DETAIL_GET_REQUEST, payload: params.id});
      }
    );

    this.store.select('merchantsDetail').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<MerchantModel>) => {
        if (error) {
          console.error('Terminal detail API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          this.merchant = data;
          this.merchantForm.patchValue(this.merchant);
          this.basicInfo = [
            [
              {
                label: this.langService.translate('basic.name'),
                value: this.merchant.name,
                formName: 'name',
              },
              {
                label: this.langService.translate('basic.code'),
                value: this.merchant.code,
                formName: 'code',
              },
              {
                label: this.langService.translate('basic.id'),
                value: this.merchant.id,
                formName: 'id',
              },
            ],
            [
              {
                label: this.langService.translate('dictionary.state'),
                value: this.merchant.state,
                formName: 'state',
                options: this.stateSelect
              },
            ],
          ];
          this.contactInfo = [
            [
              {
                label: this.langService.translate('basic.ico'),
                value: this.merchant.ico,
                formName: 'ico',
              },
              {
                label: this.langService.translate('basic.dic'),
                value: this.merchant.dic,
                formName: 'dic',
              },
              {
                label: this.langService.translate('basic.email'),
                value: this.merchant.email,
                formName: 'email',
              },
            ],
            [
              {
                label: this.langService.translate('basic.phone'),
                value: this.merchant.phone,
                formName: 'phone',
              },
              {
                label: this.langService.translate('dictionary.bankAccount'),
                value: this.merchant.bankAccount,
                formName: 'bankAccount',
              },
            ]
          ];
          this.addressInfo = [
            [
              {
                label: this.langService.translate('basic.street'),
                value: this.merchant.street,
                formName: 'street',
              },
              {
                label: this.langService.translate('basic.city'),
                value: this.merchant.city,
                formName: 'city',
              },
              {
                label: this.langService.translate('basic.zip'),
                value: this.merchant.zip,
                formName: 'zip',
              },
            ],
            [
              {
                label: this.langService.translate('basic.region'),
                value: this.merchant.region,
                formName: 'region',
              },
              {
                label: this.langService.translate('basic.country'),
                value: this.merchant.country,
                formName: 'country',
              },
            ]
          ];
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  setSelectedOption(newIndex: SelectItem): void {
    this.selectedOption = newIndex;
  }

  startEditing(): void {
    this.editing = true;
  }

  submitEdit(): void {
    this.editing = false;
    const editedMerchant = {...this.merchant, ...this.merchantForm.value};
    this.store.dispatch({type: merchantDetailActions.MERCHANT_DETAIL_POST_REQUEST, payload: editedMerchant});
  }

  cancelEditing(): void {
    this.editing = false;
    this.merchantForm.patchValue(this.merchant);
  }
}
