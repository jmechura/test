import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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
  editForm: FormGroup;
  AcquirerSections = AcquirerSections;
  editFormVisible = false;
  modalVisible = false;
  newKeyForm: FormGroup;
  keyRows: AcquirerKey[] = [];
  countries: SelectItem[] = [];


  constructor(private route: ActivatedRoute,
              private language: LanguageService,
              private fb: FormBuilder,
              private store: Store<AppStateModel>) {
    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: Params) => {
        this.store.dispatch({type: acquirerDetailActions.ACQUIRER_DETAIL_GET_REQUEST, payload: params.code});
      }
    );

    this.store.select('acquirerDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<AcquirerModel>) => {
        if (data.error) {
          console.error(`Error occurred while retrieving acquirer detail information.`, data.error);
        }
        if (data.data !== undefined && !data.loading) {
          this.acquirerData = data.data;
          this.editForm.patchValue(this.acquirerData);
          this.store.dispatch({type: acquirerKeysActions.ACQUIRER_KEYS_GET_REQUEST, payload: this.acquirerData.acquiringInstitutionCode});
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

    this.tabsOptions = [
      {
        value: AcquirerSections.BASIC,
        label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.BASIC]}`)
      },
      {
        value: AcquirerSections.ADDRESS,
        label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.ADDRESS]}`)
      },
      {
        value: AcquirerSections.KEYS,
        label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.KEYS]}`)
      }
    ];

    this.visibleTab = this.tabsOptions[0];

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      code: [{value: '', disabled: true}, Validators.required],
      acquiringInstitutionCode: ['', Validators.required],
      hsmKeyName: ['', Validators.required],
      hsmTransitKeyName: ['', Validators.required],
      country: [null],
      region: [''],
      city: [''],
      street: [''],
      zip: [''],
    });

    this.newKeyForm = this.fb.group({
      keyName: ['', Validators.required],
      keyValue: ['', Validators.required],
      last: [false]
    });
  }

  addNewKey(): void {
    this.store.dispatch({
      type: acquirerKeysActions.ACQUIRER_KEYS_POST_REQUEST,
      payload: Object.assign({}, this.newKeyForm.value, {acquirerInstitutionCode: this.acquirerData.acquiringInstitutionCode})
    });
    this.modalVisible = false;
    this.newKeyForm.reset();
  }

  editAcquirer(): void {
    // need to join two objects because of disabled element in form
    this.store.dispatch({
      type: acquirerDetailActions.ACQUIRER_DETAIL_PUT_REQUEST,
      payload: Object.assign({}, this.acquirerData, this.editForm.value)
    });
  }

  setAsLast(id: number): void {
    this.store.dispatch({
      type: acquirerKeysActions.ACQUIRER_KEYS_SET_LAST_POST_REQUEST,
      payload: id
    });
  }
  isInvalid(value: string): boolean {
    const item = this.editForm.get(value);
    return item.touched && item.invalid;
  }


  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

}
