import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { UnsubscribeSubject } from '../../shared/utils';
import { acquirerDetailActions } from '../../shared/reducers/acquirer-detail.reducer';
import { StateModel } from '../../shared/models/state.model';
import { AcquirerModel } from '../../shared/models/acquirer.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { AcquirerSections } from '../../shared/enums/acquirer-sections.enum';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcquirerKey } from '../../shared/models/acquirer-key.model';
import { acquirerKeysActions } from '../../shared/reducers/acquirer-key.reducer';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { ApiService } from '../../shared/services/api.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { ACQUIRER_KEYS_ENDPOINT } from '../../shared/effects/acquirer-keys.effect';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';


const ACQUIRERS_ROUTE = 'platform/acquirers';
const ACQUIRERS_ENDPOINT = '/networks';

@Component({
  selector: 'mss-acquirer-detail',
  templateUrl: './acquirer-detail.component.html',
  styleUrls: ['./acquirer-detail.component.scss']
})
export class AcquirerDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  acquirerData: AcquirerModel;
  tabsOptions: SelectItem[] = [];
  visibleTab: SelectItem;
  acquirerForm: FormGroup;
  AcquirerSections = AcquirerSections;
  modalVisible = false;
  newKeyForm: FormGroup;
  keyRows: AcquirerKey[] = [];
  countries: SelectItem[] = [];
  ComponentMode = ComponentMode;
  mode: ComponentMode;
  deleteModalVisible = false;
  completeView = true;

  @Input()
  set acquirerCode(code: string) {
    this.store.dispatch({type: acquirerDetailActions.ACQUIRER_DETAIL_GET_REQUEST, payload: code});
    this.completeView = false;
    this.mode = ComponentMode.View;
  }


  constructor(private route: ActivatedRoute,
              private router: Router,
              private language: LanguageService,
              private api: ApiService,
              private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private toastr: ExtendedToastrService) {
    this.acquirerForm = this.fb.group({
      name: [null, Validators.required],
      code: [{value: null, disabled: true}, Validators.required],
      acquiringInstitutionCode: [null, Validators.required],
      hsmKeyName: [null, Validators.required],
      hsmTransitKeyName: [null, Validators.required],
      country: [null],
      region: [null],
      city: [null],
      street: [null],
      zip: [null],
    });

    this.tabsOptions = [
      {
        value: AcquirerSections.BASIC,
        label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.BASIC]}`)
      },
      {
        value: AcquirerSections.ADDRESS,
        label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.ADDRESS]}`)
      },
    ];

    this.visibleTab = this.tabsOptions[0];

    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: Params) => {
        // component is not displayed through router outlet therefore there is no code
        if (!params.code) {
          return;
        }
        if (params.code !== 'create') {
          this.mode = ComponentMode.View;
          this.tabsOptions.push({
            value: AcquirerSections.KEYS,
            label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.KEYS]}`)
          });
          this.store.dispatch({type: acquirerDetailActions.ACQUIRER_DETAIL_GET_REQUEST, payload: params.code});
        } else {
          this.mode = ComponentMode.Create;
          this.acquirerForm.reset();
          this.acquirerForm.get('code').enable();
        }
      }
    );

    this.store.select('acquirerDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<AcquirerModel>) => {
        if (data.error) {
          console.error(`Error occurred while retrieving acquirer detail information.`, data.error);
        }
        if (data.data !== undefined && !data.loading) {
          if (this.mode !== ComponentMode.Create) {
            this.acquirerData = data.data;
            this.acquirerForm.patchValue(this.acquirerData);
            if (this.completeView) {
              this.store.dispatch({
                type: acquirerKeysActions.ACQUIRER_KEYS_GET_REQUEST,
                payload: this.acquirerData.acquiringInstitutionCode
              });
            }

          }
        }
      }
    );

    this.store.select('acquirerKeys').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<AcquirerKey[]>) => {
        if (data.error) {
          console.error(`Error occurred while retrieving acquirer keys information.`, data.error);
        }
        if (data.data !== undefined && !data.loading) {
          this.keyRows = data.data;
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

    this.newKeyForm = this.fb.group({
      keyName: [null, Validators.required],
      keyValue: [null],
      last: [false]
    });
  }

  addNewKey(): void {
    this.api.post(ACQUIRER_KEYS_ENDPOINT, Object.assign(
      {}, this.newKeyForm.value,
      {acquirerInstitutionCode: this.acquirerData.acquiringInstitutionCode})
    ).subscribe(
      () => {
        this.toastr.success(this.language.translate('toastr.success.addAcquirerKey'));
        this.store.dispatch({
          type: acquirerKeysActions.ACQUIRER_KEYS_GET_REQUEST,
          payload: this.acquirerData.acquiringInstitutionCode
        });
      },
      (error) => {
        this.toastr.error(this.language.translate('toastr.error.addAcquirerKey'));
      }
    );
    this.modalVisible = false;
    this.newKeyForm.reset();
  }

  editAcquirer(): void {
    // need to join two objects because of disabled element in form
    this.store.dispatch({
      type: acquirerDetailActions.ACQUIRER_DETAIL_PUT_REQUEST,
      payload: Object.assign({}, this.acquirerData, this.acquirerForm.value)
    });
    this.mode = ComponentMode.View;
  }

  setAsLast(id: number): void {
    this.api.post(`${ACQUIRER_KEYS_ENDPOINT}/last/${id}`, {}).subscribe(
      () => {
        this.toastr.success(this.language.translate('toastr.success.setKeyAsLast'));
        this.store.dispatch({
          type: acquirerKeysActions.ACQUIRER_KEYS_GET_REQUEST,
          payload: this.acquirerData.acquiringInstitutionCode
        });
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }

  isInvalid(value: string): boolean {
    const item = this.acquirerForm.get(value);
    return item.touched && item.invalid;
  }

  cancelCreateNewAcquirer(): void {
    this.router.navigateByUrl(`${ACQUIRERS_ROUTE}`);
  }

  createNewAcquirer(): void {
    this.api.post(ACQUIRERS_ENDPOINT, this.acquirerForm.value).subscribe(
      () => {
        this.toastr.success('toastr.success.createAcquirer');
        this.router.navigateByUrl(`${ACQUIRERS_ROUTE}/${this.acquirerForm.get('code').value}`);
      },
      (error) => {
        console.error('Error occurred while creating new acquirer', error);
        this.toastr.error(error);
      }
    );
  }

  deleteAcquirer(): void {
    this.api.remove(`${ACQUIRERS_ENDPOINT}/${this.acquirerData['code']}`).subscribe(
      () => {
        this.toastr.success('toastr.success.deleteAcquirer');
        this.router.navigateByUrl(`${ACQUIRERS_ROUTE}`);
      },
      (error) => {
        console.error(`Error occurred while deleting acquirer.`, error);
        this.toastr.error(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
    this.store.dispatch({type: acquirerDetailActions.ACQUIRER_DETAIL_CLEAR});
  }

  isPresentKeyName(): boolean {
    const item = this.newKeyForm.get('keyName');
    return (item.value === null || item.value === '') && item.touched;
  }
}
