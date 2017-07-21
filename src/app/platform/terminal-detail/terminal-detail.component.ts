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

interface InfoModel {
  label: string;
  value: any;
  formName?: string;
  options?: SelectItem[];
}

@Component({
  selector: 'mss-terminal-detail',
  templateUrl: './terminal-detail.component.html',
  styleUrls: ['./terminal-detail.component.scss']
})
export class TerminalDetailComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  terminal: TerminalModel;

  detailOptions: SelectItem[] = [
    {value: 'Basic', label: this.langService.translate('cardGroups.sections.BASIC')},
    {value: 'Address', label: this.langService.translate('cardGroups.sections.ADDRESS')},
  ];
  selectedOption = this.detailOptions[0];

  basicInfo: InfoModel[][];
  addressInfo: InfoModel[][];

  stateSelect: SelectItem[] = [
    { value: 'ENABLED'},
    { value: 'DISABLED'}
  ];

  editing = false;

  terminalForm: FormGroup;

  setSelectedOption(newIndex: SelectItem): void {
    this.selectedOption = newIndex;
  }

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
          this.basicInfo = [
            [
              {
                label: this.langService.translate('basic.name'),
                value: this.terminal.name,
                formName: 'name',
              },
              {
                label: this.langService.translate('basic.code'),
                value: this.terminal.code,
                formName: 'code',
              },
              {
                label: this.langService.translate('basic.id'),
                value: this.terminal.id,
                formName: 'id',
              },
            ],
            [
              {
                label: this.langService.translate('dictionary.orgUnitCode'),
                value: this.terminal.orgUnitId,
                formName: 'orgUnitId',
              },
              {
                label: this.langService.translate('terminals.detail.merchantId'),
                value: this.terminal.merchantId,
                formName: 'merchantId',
              },
              {
                label: this.langService.translate('dictionary.merchantCode'),
                value: this.terminal.merchantCode,
                formName: 'merchantCode',
              },
              {
                label: this.langService.translate('dictionary.state'),
                value: this.terminal.state,
                formName: 'state',
                options: this.stateSelect
              },
            ],
          ];
          this.addressInfo = [
            [
              {
                label: this.langService.translate('basic.street'),
                value: this.terminal.street,
                formName: 'street',
              },
              {
                label: this.langService.translate('basic.city'),
                value: this.terminal.city,
                formName: 'city',
              },
              {
                label: this.langService.translate('basic.zip'),
                value: this.terminal.zip,
                formName: 'zip',
              },
            ],
            [
              {
                label: this.langService.translate('basic.region'),
                value: this.terminal.region,
                formName: 'region',
              },
              {
                label: this.langService.translate('basic.country'),
                value: this.terminal.country,
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

  startEditing(): void {
    this.editing = true;
  }

  cancelEditing(): void {
    this.editing = false;
    this.terminalForm.patchValue(this.terminal);
  }

  submitEdit(): void {
    this.editing = false;
    const editedTerminal = { ...this.terminal, ...this.terminalForm.value};
    this.store.dispatch({type: terminalDetailActions.TERMINAL_DETAIL_POST_REQUEST, payload: editedTerminal});
  }
}
