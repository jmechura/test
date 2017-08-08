import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TerminalModel } from '../../shared/models/terminal.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../shared/services/language.service';
import { AppStateModel } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { terminalDetailActions } from '../../shared/reducers/terminal-detail.reducer';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { TerminalDetailSections } from 'app/shared/enums/terminal-detail-sections.enum';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { ApiService } from '../../shared/services/api.service';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { ProfileModel } from 'app/shared/models/profile.model';
import { RoleService } from '../../shared/services/role.service';

enum Mode {
  View,
  Edit,
  Create
}

const TERMINALS_ROUTE = 'platform/terminal';
const API_ENDPOINT = '/terminals';

@Component({
  selector: 'mss-terminal-detail',
  templateUrl: './terminal-detail.component.html',
  styleUrls: ['./terminal-detail.component.scss']
})
export class TerminalDetailComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  terminal: TerminalModel;

  tabsOptions: SelectItem[] = [];
  TerminalDetailSections = TerminalDetailSections;
  visibleTab: SelectItem;

  stateOptions: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];
  countries: SelectItem[] = [];
  networkCodes: SelectItem[] = [];
  merchantCodes: SelectItem[] = [];
  orgUnitCodes: SelectItem[] = [];

  editing = false;

  terminalForm: FormGroup;
  Mode = Mode;
  mode: Mode;

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private router: Router,
              private toastr: ExtendedToastrService,
              private api: ApiService,
              private roles: RoleService,
              private fb: FormBuilder) {

    this.terminalForm = this.fb.group(
      {
        name: ['', Validators.required], // Edit
        code: ['', Validators.required],
        orgUnitId: [{value: '', disabled: true}, Validators.required],
        merchantId: [{value: '', disabled: true}, Validators.required],
        state: {value: '', disabled: true},
        street: [''],
        city: [''],
        zip: [''],
        region: [''],
        country: [null],
        networkCode: [{value: '', disabled: true}, Validators.required], // Create
        note: [{value: '', disabled: true}],
      }
    );

    this.tabsOptions = [
      {
        label: this.langService.translate('cardGroups.sections.BASIC'),
        value: this.TerminalDetailSections.BASIC
      },
      {
        label: this.langService.translate('cardGroups.sections.ADDRESS'),
        value: this.TerminalDetailSections.ADDRESS
      },
    ];
    this.visibleTab = this.tabsOptions[0];

    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});

    this.route.params.subscribe(
      (params: Params) => {
        // component is not displayed through router outlet therefore there is no code
        if (!params.id) {
          return;
        }
        if (params.id !== 'create') {
          this.mode = Mode.View;
          this.store.dispatch({type: terminalDetailActions.TERMINAL_DETAIL_GET_REQUEST, payload: params.id});
          this.terminalForm.get('state').enable();
        } else {
          this.mode = Mode.Create;
          this.terminalForm.setValue({
            name: '',
            code: '',
            orgUnitId: '',
            merchantId: '',
            state: '',
            street: '',
            city: '',
            zip: '',
            region: '',
            country: null,
            networkCode: '',
            note: '',
          });
          this.terminalForm.get('note').enable();
          this.terminalForm.get('networkCode').enable();
        }
      }
    );

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<ProfileModel>) => {
        if (data.error) {
          if (data.error instanceof MissingTokenResponse) {
            return;
          }
          console.error('Profile API call has returned error', data.error);
          return;
        }
        if (data.data && !data.loading && this.mode === this.Mode.Create) {
          const user = data.data;

          this.roles.isVisible('terminals.formNetworkSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('terminals.formMerchantSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    } else {

                      this.roles.isVisible('terminals.formOrgUnitSelect').subscribe(
                        orgUnitResult => {
                          if (orgUnitResult) {
                            this.store.dispatch({
                              type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST,
                              payload: user.resourceAcquirerId
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );

    this.store.select('terminalDetail').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<TerminalModel>) => {
        if (error) {
          console.error('Terminal detail API call has returned error', error);
          return;
        }
        if (data != null && !loading && this.mode !== this.Mode.Create) {
          this.terminal = data;
          this.terminalForm.patchValue(this.terminal);
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
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Network code API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.networkCodes = data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Merchant code API call has returned error', error);
          return;
        }
        if (data != undefined && this.mode === this.Mode.Create) {
          this.merchantCodes = data.map(item => ({value: item.id, label: item.code}));
          this.terminalForm.get('merchantId').enable();
        } else {
          this.terminalForm.get('merchantId').disable();
        }
      }
    );

    this.store.select('orgUnitCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('ORG Unit code API call has returned error', error);
          return;
        }
        if (data != undefined && this.mode === this.Mode.Create) {
          this.orgUnitCodes = data.map(item => ({value: item.id, label: item.code}));
          this.terminalForm.get('orgUnitId').enable();
        } else {
          this.terminalForm.get('orgUnitId').disable();
        }
      }
    );

    this.terminalForm.get('networkCode').valueChanges.takeUntil(this.unsubscribe$).subscribe(
      (value: string | number) => {
        if (value == null || value.toString().length === 0) {
          return;
        }
        if (this.mode === this.Mode.Create) {
          this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: value});
          this.terminalForm.get('merchantId').reset();
          this.terminalForm.get('orgUnitId').disable();
        }
      }
    );

    this.terminalForm.get('merchantId').valueChanges.takeUntil(this.unsubscribe$).subscribe(
      (value: string | number) => {
        if (value == null || value.toString().length === 0) {
          return;
        }
        if (this.mode === this.Mode.Create) {
          this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: value});
          this.terminalForm.get('orgUnitId').reset();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  isPresent(value: string): boolean {
    const item = this.terminalForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  startEditing(): void {
    this.mode = this.Mode.Edit;
  }

  cancelEditing(): void {
    this.mode = this.Mode.View;
    this.terminalForm.patchValue(this.terminal);
  }

  submitEdit(): void {
    if (!this.terminalForm.invalid) {
      this.mode = this.Mode.View;
      const editedTerminal = {...this.terminal, ...this.terminalForm.value};
      this.store.dispatch({type: terminalDetailActions.TERMINAL_DETAIL_POST_REQUEST, payload: editedTerminal});
    }
  }

  cancelCreateNewTerminal(): void {
    this.router.navigateByUrl(TERMINALS_ROUTE);
  }

  createNewTerminal(): void {
    if (!this.terminalForm.invalid) {
      this.api.post(`${API_ENDPOINT}`, this.terminalForm.value).subscribe(
        (newTerminal: TerminalModel) => {
          this.toastr.success('toastr.success.createTerminal');
          this.router.navigateByUrl(`${TERMINALS_ROUTE}/${newTerminal.id}`);
        },
        (error) => {
          this.toastr.error(error);
          console.error('Terminal API call returned error.', error);
        }
      );
    }
  }
}
