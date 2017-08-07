import { Component, Input, OnDestroy } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { ApiService } from '../../shared/services/api.service';
import { OrgUnitModel } from '../../shared/models/org-unit.model';
import { OrgUnitState, orgUnitActions } from '../../shared/reducers/org-unit.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateModel } from '../../shared/models/state.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { networkCodeActions, NetworkCodeState } from '../../shared/reducers/network-code.reducer';
import { merchantCodeActions, MerchantCodeState } from '../../shared/reducers/merchant-code.reducer';
import { RoleService } from '../../shared/services/role.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

const TAB_OPTIONS = ['BASIC', 'MERCHANT', 'ADDRESS', 'NOTE'];
const ORG_UNIT_ENDPOINT = '/orgUnits';

@Component({
  selector: 'mss-org-unit-detail',
  templateUrl: './org-unit-detail.component.html',
  styleUrls: ['./org-unit-detail.component.scss']
})
export class OrgUnitDetailComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  orgUnit: OrgUnitModel;
  mode: ComponentMode;
  ComponentMode = ComponentMode;
  tabOptions: SelectItem[] = [];
  visibleTab: SelectItem;
  form: FormGroup;
  networkOptions: SelectItem[] = [];
  merchantOptions: SelectItem[] = [];

  @Input()
  set orgUnitId(id: string) {
    this.completeView = false;
    this.store.dispatch({type: orgUnitActions.ORG_UNIT_GET_REQUEST, payload: id});
    this.mode = this.ComponentMode.View;
  }

  @Input() completeView = true;


  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private language: LanguageService,
              private api: ApiService,
              private roles: RoleService,
              private fb: FormBuilder,
              private router: Router,
              private toastr: ExtendedToastrService,
              private location: Location) {


    this.tabOptions = TAB_OPTIONS.map(tab => ({
      value: tab,
      label: this.language.translate(`orgUnits.detail.sections.${tab}`)
    }));
    this.visibleTab = this.tabOptions[0];

    this.form = this.fb.group({
      city: '',
      code: ['', Validators.required],
      id: [''],
      merchantId: [{value: '', disabled: true}, Validators.required],
      name: ['', Validators.required],
      note: [''],
      networkCode: [{value: '', disabled: true}, Validators.required],
      region: [''],
      state: 'ENABLED',
      street: [''],
      zip: ['']
    });

    this.route.params.subscribe(
      (params: { id: string }) => {
        if (params.id !== 'create') {
          this.store.dispatch({type: orgUnitActions.ORG_UNIT_GET_REQUEST, payload: params.id});
          this.mode = ComponentMode.View;
        } else {
          this.mode = ComponentMode.Create;
        }

      }
    );

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
          this.roles.isVisible('createEdit.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
                this.form.get('networkCode').valueChanges.takeUntil(this.unsubscribe$).subscribe(networkCode => {
                  if (networkCode !== null && networkCode.length > 0) {
                    this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: networkCode});
                  }
                });
              } else {
                this.form.get('networkCode').enable();
                this.form.patchValue({networkCode: user.networkCode});
                this.roles.isVisible('createEdit.merchantCodeSelect').subscribe(
                  merchantResult => {
                    if (merchantResult) {
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    } else {
                      this.form.get('merchantId').enable();
                      this.form.patchValue({merchantId: user.resourceAcquirerId});
                      this.tabOptions = this.tabOptions.filter(tab => tab.value !== 'MERCHANT');
                    }
                  }
                );
              }
            }
          );
        }
      }
    );

    this.store.select('orgUnit').takeUntil(this.unsubscribe$).subscribe(
      (state: OrgUnitState) => {
        if (state.error !== null) {
          console.error('Error getting org unit', state.error);
          return;
        }

        if (state.data != undefined && !state.loading) {
          this.orgUnit = state.data;
          this.form.patchValue(state.data);
        }
      }
    );

    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      (state: NetworkCodeState) => {
        if (state.error !== null) {
          console.error('Error getting network codes', state.error);
          return;
        }

        if (state.data != undefined && !state.loading) {
          this.form.get('networkCode').enable();
          this.networkOptions = state.data.map(network => ({value: network.id, label: network.name}));
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      (state: MerchantCodeState) => {
        if (state.error !== null) {
          console.error('Error getting merchant codes', state.error);
          return;
        }

        if (state.data && !state.loading) {
          this.form.get('merchantId').enable();
          this.merchantOptions = state.data.map(merchant => ({value: merchant.id, label: merchant.name}));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
    this.store.dispatch({type: orgUnitActions.CLEAR});
  }

  isInvalid(value: string): boolean {
    const item = this.form.get(value);
    return item.touched && item.invalid;
  }

  updateOrgUnit(): void {
    this.store.dispatch({
      type: orgUnitActions.ORG_UNIT_PUT_REQUEST,
      payload: {...this.orgUnit, ...this.form.value}
    });
  }

  addOrgUnit(): void {
    this.api.post(ORG_UNIT_ENDPOINT, this.form.value).subscribe(
      (model: OrgUnitModel) => {
        this.toastr.success('toastr.success.createOrgUnit');
        this.router.navigateByUrl(`platform/org-units/${model.id}`);
      },
      error => {
        this.toastr.error(error);
        console.error('Error creating org unit', error);
      }
    );
  }

  dismissForm(): void {
    if (this.mode === this.ComponentMode.Edit) {
      this.mode = ComponentMode.View;
    } else {
      this.location.back();
    }
  }
}
