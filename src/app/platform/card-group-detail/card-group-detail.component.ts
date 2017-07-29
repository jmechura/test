import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { AppConfigService } from '../../shared/services/app-config.service';
import { AddressModel } from '../../shared/models/address.model';
import { addressTypeActions } from '../../shared/reducers/address-type.reducer';
import { addressDetailActions } from '../../shared/reducers/address-detail.reducer';
import { ApiService } from '../../shared/services/api.service';
import { RoleService } from 'app/shared/services/role.service';

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

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private configService: AppConfigService,
              private roles: RoleService,
              private api: ApiService) {
    this.route.params.subscribe(
      (params: { id: string }) => {
        this.store.dispatch({type: cardGroupDetailActions.CARD_GROUP_DETAIL_GET_REQUEST, payload: params.id});
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
          this.cardGroupDetail = data.data;
          this.editForm.patchValue(this.cardGroupDetail);
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

    this.editForm = fb.group(
      {
        name: ['', Validators.required],
        limitType: [''],
        limit: [0],
        state: ['ENABLED'],
        ico: [''],
        dic: [''],
        email: ['', optionalEmailValidator],
        phone: [''],
        contact: [''],
        contact2: [''],
        bankAccount: [''],
        taxType: ['UNKNOWN'],
        taxValue: [0],
        street: [''],
        city: [''],
        zip: ['']
      }
    );

    this.addressForm = fb.group({
        addressName: ['', Validators.required],
        city: ['', Validators.required],
        contact: [''],
        contact2: [''],
        country: ['', Validators.required],
        dic: [''],
        email: ['', optionalEmailValidator],
        ico: [''],
        phone: ['', Validators.pattern(/^\+42[0-9]{10}$/)],
        resource: [''],
        resourceId: [''],
        street: ['', Validators.required],
        type: [''],
        zip: ['', Validators.required],
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

  editCardGroup(): void {
    this.edit = false;
    this.store.dispatch(
      {
        type: cardGroupDetailActions.CARD_GROUP_DETAIL_PUT_REQUEST,
        payload: Object.assign({}, this.cardGroupDetail, this.editForm.value)
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  startEditing(): void {
    this.edit = true;
  }

  cancelEditing(): void {
    this.edit = false;
    this.editForm.patchValue(this.cardGroupDetail);
  }

  get cardGroupTabsOptions(): TabOptions[] {
    const tabs = (!this.limitsAllowed ?
      this.tabsOptions.filter((item) => (item.value !== CardGroupSections.LIMITS)) : this.tabsOptions);
    return !this.createDefaultDeliveryAddress ?
      tabs.filter((item) => item.value !== CardGroupSections.DELIVERYADRESS) : tabs;
  }

  changeAddressType(value: string): void {
    this.selectedAddressType = value;
    this.store.dispatch({type: addressDetailActions.ADDRESS_DETAIL_GET_REQUEST, payload: {
      resource: 'CARD_GROUP', resourceId: this.cardGroupDetail.id, type: value
    }});
  }

  startAddressEditing(): void {
    this.editAddress = true;
  }

  cancelAddressEditing(): void {
    this.editAddress = false;
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
          this.addressForm.reset();
          this.store.dispatch({type: addressDetailActions.ADDRESS_DETAIL_GET_REQUEST, payload: {
            resource: 'CARD_GROUP', resourceId: this.cardGroupDetail.id, type: this.selectedAddressType
          }});
        },
        error => {
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
          this.addressForm.reset();
          this.store.dispatch({type: addressDetailActions.ADDRESS_DETAIL_GET_REQUEST, payload: {
            resource: 'CARD_GROUP', resourceId: this.cardGroupDetail.id, type: this.selectedAddressType
          }});
        },
        error => {
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
