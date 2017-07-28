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
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { RoleService } from '../../shared/services/role.service';
import { MerchantDetailSections } from 'app/shared/enums/merchant-detail-sections.enum';

@Component({
  selector: 'mss-merchants-detail',
  templateUrl: './merchants-detail.component.html',
  styleUrls: ['./merchants-detail.component.scss']
})
export class MerchantsDetailComponent implements OnDestroy {
  merchant: MerchantModel;
  editing = false;
  merchantForm: FormGroup;
  stateOptions: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];
  networkCodes: SelectItem[] = [];
  countries: SelectItem[] = [];
  MerchantDetailSections = MerchantDetailSections;
  tabsOptions: SelectItem[] = [];
  visibleTab: SelectItem;
  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private fb: FormBuilder,
              private roles: RoleService) {

    this.merchantForm = this.fb.group(
      {
        name: ['', Validators.required],
        code: ['', Validators.required],
        id: ['', Validators.required],
        state: '',
        ico: ['', Validators.required],
        dic: ['', Validators.required],
        email: ['', control => control.value === '' ? null : Validators.email(control)],
        phone: '',
        bankAccount: '',
        street: ['', Validators.required],
        city: ['', Validators.required],
        zip: ['', Validators.required],
        region: '',
        country: ['', Validators.required],
        note: '',
        networkCode: [{value: '', disabled: true}, Validators.required],
      }
    );

    this.tabsOptions = [
      {
        label: this.langService.translate('merchants.detail.BASIC'),
        value: this.MerchantDetailSections.BASIC
      },
      {
        label: this.langService.translate('merchants.detail.contact'),
        value: this.MerchantDetailSections.CONTACT
      },
      {
        label: this.langService.translate('basic.address'),
        value: this.MerchantDetailSections.ADDRESS
      },
    ];
    this.visibleTab = this.tabsOptions[0];

    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});

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
        }
      }
    );

    this.roles.isVisible('filters.networkCodeSelect').subscribe(
      networkResult => {
        if (networkResult) {
          this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
        }
      }
    );

    this.store.select('countryCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting country codes from api.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.countries = data.data.map(country => ({value: country}));
        }
      }
    );

    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting network codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.networkCodes = data.data.map(item => ({label: item.code, value: item.id}));
          this.merchantForm.get('networkCode').enable();
        }
      }
    );
  }

  isPresent(value: string): boolean {
    const item = this.merchantForm.get(value);
    if (value === 'email') {
      return item.touched && item.value !== '' && item.errors != null;
    }
    return item.touched && item.errors != null && item.errors.required;
  }

  isPresentNetworkCode(): boolean {
    const item = this.merchantForm.get('networkCode');
    return (item.value === null || item.value === '') && item.touched;
  }

  isPresentCountry(): boolean {
    const item = this.merchantForm.get('country');
    return (item.value === null || item.value === '') && item.touched;
  }

  isValidEmail(value: string): boolean {
    const item = this.merchantForm.get(value);
    return item.touched && item.value !== '' && item.errors != null;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
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
