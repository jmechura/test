import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { TerminalModel } from '../../shared/models/terminal.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../shared/services/language.service';
import { AppStateModel } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { UnsubscribeSubject } from '../../shared/utils';
import { terminalDetailActions } from '../../shared/reducers/terminal-detail.reducer';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { TerminalDetailSections } from 'app/shared/enums/terminal-detail-sections.enum';

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

  editing = false;

  terminalForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private langService: LanguageService,
              private fb: FormBuilder) {

    this.terminalForm = this.fb.group(
      {
        name: ['', Validators.required],
        code: ['', Validators.required],
        id: ['', Validators.required],
        orgUnitId: [{value: '', disabled: true}, Validators.required],
        merchantId: {value: '', disabled: true},
        merchantCode: {value: '', disabled: true},
        state: '',
        street: '',
        city: '',
        zip: '',
        region: '',
        country: '',
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
      (params: { id: string }) => {
        this.store.dispatch({type: terminalDetailActions.TERMINAL_DETAIL_GET_REQUEST, payload: params.id});
      }
    );

    this.store.select('terminalDetail').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<TerminalModel>) => {
        if (error) {
          console.error('Terminal detail API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  isPresent(value: string): boolean {
    const item = this.terminalForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  startEditing(): void {
    this.editing = true;
  }

  cancelEditing(): void {
    this.editing = false;
    this.terminalForm.patchValue(this.terminal);
  }

  submitEdit(): void {
    this.editing = false;
    const editedTerminal = {...this.terminal, ...this.terminalForm.value};
    this.store.dispatch({type: terminalDetailActions.TERMINAL_DETAIL_POST_REQUEST, payload: editedTerminal});
  }
}
