import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { cardGroupDetailActions } from '../../shared/reducers/card-group-detail.reducer';
import { StateModel } from '../../shared/models/state.model';
import { CardGroupModel } from '../../shared/models/card-group.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { optionalEmailValidator } from '../../shared/validators/optional-email.validator';
import { CardGroupSections } from '../../shared/enums/card-group-sections.enum';
import { taxTypeActions } from '../../shared/reducers/tax-types.reducer';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { AppConfigService } from '../../shared/services/app-config.service';
import { AddressModel } from '../../shared/models/address.model';
import { addressTypeActions } from '../../shared/reducers/address-type.reducer';
import { addressDetailActions } from '../../shared/reducers/address-detail.reducer';
import { ApiService } from '../../shared/services/api.service';
import { RoleService } from 'app/shared/services/role.service';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';
import { ProfileModel } from '../../shared/models/profile.model';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

interface TabOptions {
  label: string;
  value: CardGroupSections;
}

@Component({
  selector: 'mss-card-group-detail',
  templateUrl: './card-group-detail.component.html',
  styleUrls: ['./card-group-detail.component.scss']
})
export class CardGroupDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  cardGroupDetail: CardGroupModel;
  tabsOptions: TabOptions[] = [];
  CardGroupSections = CardGroupSections;
  visibleTab: SelectItem;
  stateOptions: SelectItem[] = [{value: 'ENABLED'}, {value: 'DISABLED'}];
  limitOptions: SelectItem[] = [{value: 'ENABLED'}];
  taxTypes: SelectItem[] = [];
  editForm: FormGroup;
  addressForm: FormGroup;
  edit = false;
  modalVisible = false;
  createDefaultDeliveryAddress = false;
  deliveryAddress: AddressModel;
  addressTypes: SelectItem[] = [];
  selectedAddressType: string;
  creatingAddress = true;
  editAddress = false;
  limitsAllowed = false;
  countries: SelectItem[] = [];
  completeView = true;
  mode = ComponentMode.View;
  ComponentMode = ComponentMode;
  issuerCodes: SelectItem[] = [];
  user: ProfileModel;

  @Input()
  set cardGroupId(id: string) {
    this.store.dispatch({type: cardGroupDetailActions.CARD_GROUP_DETAIL_GET_REQUEST, payload: id});
    this.completeView = false;
    this.mode = ComponentMode.View;
  }

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private configService: AppConfigService,
              private router: Router,
              private roles: RoleService,
              private api: ApiService,
              private toastr: ExtendedToastrService) {

    this.editForm = fb.group(
      {
        name: [null, Validators.required],
        code: [null, Validators.required],
        issuerCode: [{value: null, disabled: true}, Validators.required],
        externalCode: [null],
        limitType: [null],
        limit: [0],
        state: ['ENABLED'],
        ico: [null, Validators.required],
        dic: [null, Validators.required],
        email: [null, [Validators.email, Validators.required]],
        contact: [null],
        contact2: [null],
        bankAccount: [null],
        specificSymbol: [null],
        taxType: ['UNKNOWN'],
        taxValue: [0],
        phone: [null, Validators.pattern(/^\+42[0-9]{10}$/)],
        street: [null, Validators.required],
        city: [null, Validators.required],
        zip: [null, Validators.required],
        country: [null, Validators.required],
      }
    );

    this.addressForm = fb.group({
        addressName: [null, Validators.required],
        city: [null, Validators.required],
        contact: [null],
        contact2: [null],
        country: [null, Validators.required],
        dic: [null],
        email: [null, optionalEmailValidator],
        ico: [null],
        phone: [null, Validators.pattern(/^\+42[0-9]{10}$/)],
        resource: [null],
        resourceId: [null],
        street: [null, Validators.required],
        type: [null],
        zip: [null, Validators.required],
      }
    );

    this.tabsOptions = [
      {
        label: this.langService.translate('cardGroups.sections.BASIC'),
        value: CardGroupSections.BASIC
      },
      {
        label: this.langService.translate('cardGroups.sections.LIMITS'),
        value: CardGroupSections.LIMITS
      },
      {
        label: this.langService.translate('cardGroups.sections.CONTACTS'),
        value: CardGroupSections.CONTACTS
      },
      {
        label: this.langService.translate('cardGroups.sections.ADDRESS'),
        value: CardGroupSections.ADDRESS
      },
      {
        label: this.langService.translate('cardGroups.sections.DELIVERYADRESS'),
        value: CardGroupSections.DELIVERYADRESS
      }
    ];
    this.visibleTab = this.tabsOptions[0];

    this.route.params.subscribe(
      (params: { id: string }) => {
        if (!params.id) {
          return;
        }
        if (params.id !== 'create') {
          this.mode = ComponentMode.View;
          this.store.dispatch({type: cardGroupDetailActions.CARD_GROUP_DETAIL_GET_REQUEST, payload: params.id});
        } else {
          this.mode = ComponentMode.Create;
          this.edit = true;
          this.tabsOptions = this.tabsOptions.filter(opt => opt.value !== CardGroupSections.DELIVERYADRESS);
        }
      }
    );

    this.roles.isVisible('cardGroups.limits').subscribe(
      limitsResult => {
        if (limitsResult) {
          this.limitsAllowed = true;
        }
      }
    );

    this.configService.get('createDefaultDeliveryAddress').subscribe(
      address => {
        this.createDefaultDeliveryAddress = address;
      }
    );

    this.store.dispatch({type: taxTypeActions.TAX_TYPES_GET_REQUEST});

    this.store.select('cardGroupDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CardGroupModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card group detail from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          if (this.mode !== ComponentMode.Create) {
            this.cardGroupDetail = data.data;
            this.editForm.patchValue(this.cardGroupDetail);
          } else {
            this.editForm.reset();
          }
        }
      }
    );

    this.store.select('taxTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving tax types from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.taxTypes = data.data.map(item => ({value: item}));
        }
      }
    );
    this.store.select('addressDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<AddressModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving tax types from API.', data.error);
          return;
        }
        this.creatingAddress = true;
        if (data.data !== undefined && !data.loading) {
          this.deliveryAddress = data.data;
          this.addressForm.patchValue(this.deliveryAddress);
          if (data.data !== '') {
            this.creatingAddress = false;
          }
        }
      }
    );
    this.store.select('addressType').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving tax types from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.addressTypes = data.data.map(item => ({value: item}));
        }
      }
    );
    this.store.dispatch({type: addressTypeActions.ADDRESS_TYPE_GET_REQUEST});
    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});

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

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<ProfileModel>) => {
        if (error instanceof MissingTokenResponse) {
          return;
        }

        if (error !== null) {
          console.error('Error occurred while retrieving profile', error);
          return;
        }

        if (data != null && !loading) {
          this.user = data;
          this.roles.isVisible('createEdit.issuerCodeSelect').subscribe(
            issuerResult => {
              if (issuerResult) {
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
                this.editForm.get('issuerCode').enable();
              }
            }
          );
          this.roles.isVisible('cardGroups.limits').subscribe(
            limitsResult => {
              if (!limitsResult) {
                this.tabsOptions = this.tabsOptions.filter(opt => opt.value !== CardGroupSections.LIMITS);
              }
            }
          );
        }
      }
    );

    this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving issuer codes.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.issuerCodes = data.data.map(code => ({value: code.id, label: code.code}));
        }
      }
    );
  }

  toggleCardGroup(): void {
    this.store.dispatch(
      {
        type: cardGroupDetailActions.CARD_GROUP_DETAIL_PUT_REQUEST,
        payload: Object.assign({}, this.cardGroupDetail, {
          state: this.cardGroupDetail.state === 'ENABLED' ? 'DISABLED' : 'ENABLED'
        })
      }
    );
    this.modalVisible = false;
  }

  handleFormSubmit(): void {
    if (this.mode === ComponentMode.Edit) {
      this.edit = false;
      this.mode = this.ComponentMode.View;
      this.store.dispatch(
        {
          type: cardGroupDetailActions.CARD_GROUP_DETAIL_PUT_REQUEST,
          payload: Object.assign({}, this.cardGroupDetail, this.editForm.value)
        }
      );
    } else {
      this.configService.get('createSpecSymbol').subscribe(
        symbol => {
          let payload = {...this.editForm.value, createSpecSymbol: symbol};
          if (this.editForm.get('issuerCode').disabled) {
            payload = {...payload, issuerCode: this.user.resourceId};
          }
          this.configService.get('createDefaultDeliveryAddress').subscribe(
            address => {
              payload = {...payload, createDefaultDeliveryAddress: address};
              this.api.post('/cardgroups', payload).subscribe(
                (data: CardGroupModel) => {
                  this.router.navigateByUrl(`platform/card-groups/${data.id}`);
                },
                (error) => {
                  this.toastr.error(error);
                  console.error('data', error);
                }
              );
            }
          );
        }
      );
    }
  }


  isPresent(value: string): boolean {
    const item = this.editForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  isValidEmail(): boolean {
    const item = this.editForm.get('email');
    return item.touched && item.errors && item.errors.email;
  }

  addresssValidEmail(): boolean {
    const item = this.addressForm.get('email');
    return item.touched && item.errors && item.errors.email;
  }

  isValidPhone(): boolean {
    const item = this.editForm.get('phone');
    return item.touched && item.errors && item.errors.pattern;
  }

  isPresentCountry(): boolean {
    const item = this.editForm.get('country');
    return (item.value === null || item.value === '') && item.touched;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
    this.store.dispatch({type: cardGroupDetailActions.CARD_GROUP_DETAIL_CLEAR});
  }

  startEditing(): void {
    this.edit = true;
    this.mode = ComponentMode.Edit;
  }

  cancelEditing(): void {
    this.edit = false;
    this.mode = this.ComponentMode.View;
    this.editForm.patchValue(this.cardGroupDetail);
  }

  goToList(): void {
    this.router.navigateByUrl('platform/card-groups');
  }

  get cardGroupTabsOptions(): TabOptions[] {
    const tabs = (!this.limitsAllowed ?
      this.tabsOptions.filter((item) => (item.value !== CardGroupSections.LIMITS)) : this.tabsOptions);
    return !this.createDefaultDeliveryAddress ?
      tabs.filter((item) => item.value !== CardGroupSections.DELIVERYADRESS) : tabs;
  }

  changeAddressType(value: string): void {
    this.selectedAddressType = value;
    this.store.dispatch({
      type: addressDetailActions.ADDRESS_DETAIL_GET_REQUEST, payload: {
        resource: 'CARD_GROUP', resourceId: this.cardGroupDetail.id, type: value
      }
    });
  }

  startAddressEditing(): void {
    this.editAddress = true;
    this.mode = ComponentMode.Edit;
  }

  cancelAddressEditing(): void {
    this.editAddress = false;
    this.mode = ComponentMode.View;
    this.addressForm.patchValue(this.deliveryAddress);
  }

  submitAddress(): void {
    this.editAddress = false;
    if (this.creatingAddress) {
      this.api.post('/adresses', {
        ...this.addressForm.value,
        resource: 'CARD_GROUP',
        resourceId: this.cardGroupDetail.id,
        type: this.selectedAddressType,
      }).subscribe(
        () => {
          this.toastr.success('toastr.success.submitAddress');
          this.addressForm.reset();
          this.store.dispatch({
            type: addressDetailActions.ADDRESS_DETAIL_GET_REQUEST, payload: {
              resource: 'CARD_GROUP', resourceId: this.cardGroupDetail.id, type: this.selectedAddressType
            }
          });
        },
        error => {
          this.toastr.error(error);
          console.error('Create address fail', error);
        }
      );
    } else {
      this.api.post('/adresses', {
        ...this.addressForm.value,
        resource: 'CARD_GROUP',
        resourceId: this.cardGroupDetail.id,
        type: this.selectedAddressType,
      }).subscribe(
        () => {
          this.toastr.success('toastr.success.submitAddress');
          this.addressForm.reset();
          this.store.dispatch({
            type: addressDetailActions.ADDRESS_DETAIL_GET_REQUEST, payload: {
              resource: 'CARD_GROUP', resourceId: this.cardGroupDetail.id, type: this.selectedAddressType
            }
          });
        },
        error => {
          this.toastr.error(error);
          console.error('Create address fail', error);
        }
      );
    }
  }

  isInvalid(value: string): boolean {
    const item = this.addressForm.get(value);
    return item.touched && item.invalid;
  }
}
