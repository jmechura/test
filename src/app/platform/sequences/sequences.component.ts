import { Component, OnDestroy, ViewChild } from '@angular/core';
import { StateModel } from '../../shared/models/state.model';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { sequencesTypeActions } from '../../shared/reducers/sequences-type.reducer';
import { userResourceActions } from '../../shared/reducers/user-resource.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fillSequence, SequencesModel } from '../../shared/models/sequences.model';
import { CodeModel } from '../../shared/models/code.model';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { sequencesActions } from '../../shared/reducers/sequences.reducer';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'mss-sequences',
  templateUrl: './sequences.component.html',
  styleUrls: ['./sequences.component.scss']
})
export class SequencesComponent implements OnDestroy {

  sequenceRows: any[];
  loading = false;
  rowLimit = 10;

  edit = null;
  editTemplate = '';
  editOrder = null;

  sequencesType: SelectItem[] = [];
  userResource: SelectItem[] = [];
  newSequenceForm: FormGroup;
  modalShowing = false;
  private unsubscribe$ = new UnsubscribeSubject();
  newSequence = fillSequence();
  code: SelectItem[];

  showSubSelect: 'MERCHANT' | 'ORG_UNIT' | 'CARD_GROUP';
  subSelectMenu: SelectItem[] = [];
  subSelectValue: number;

  thirdSelectMenu: SelectItem[] = [];
  thirdSelectValue: number;

  deletingRow: any;
  warnModalVisible = false;

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private language: LanguageService,
              private fb: FormBuilder) {
    this.store.dispatch({type: sequencesTypeActions.SEQUENCES_TYPE_API_GET});
    this.store.dispatch({type: userResourceActions.USER_RESOURCE_GET_REQUEST});
    this.store.dispatch({type: sequencesActions.SEQUENCES_GET_REQUEST});

    this.newSequenceForm = fb.group({
      type: ['', Validators.required],
      resource: ['', Validators.required],
      order: ['', Validators.required],
      template: ['', Validators.required],
      code: [{value: '', disabled: true}, Validators.required]
    });

    this.store.select('sequences').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<SequencesModel[]>) => {
        this.loading = loading;
        if (error) {
          console.error('Sequence API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.sequenceRows = data.map(item => ({
            order: item.order,
            template: item.template,
            resource: item.pk.resource,
            resourceId: item.pk.resourceId,
            type: item.pk.type
          }));
        }
      }
    );

    this.store.select('sequencesType').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('Sequence type API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.sequencesType = data.map(item => ({
            value: item,
            label: this.language.translate(`enums.sequenceTypes.${item}`)
          }));
        }
      }
    );

    this.store.select('userResource').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('User resource API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.userResource = data
            .filter(item => (item !== 'SYSTEM') && (item !== 'CARD') && (item !== 'TERMINAL'))
            .map(item => ({
              value: item,
              label: this.language.translate(`enums.resources.${item}`)
            }));
        }
      }
    );

    this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Issuers code API call has returned error', error);
          return;
        }
        if (data != undefined) {
          if (this.showSubSelect) {
            this.subSelectMenu = data.map(item => ({value: item.id, label: item.code}));
          } else {
            this.code = data.map(item => ({value: item.id, label: item.code}));
            this.newSequenceForm.controls['code'].enable();
          }
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
          if (this.showSubSelect) {
            this.subSelectMenu = data.map(item => ({value: item.id, label: item.code}));
          } else {
            this.code = data.map(item => ({value: item.id, label: item.code}));
            this.newSequenceForm.controls['code'].enable();
          }
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Merhcant code API call has returned error', error);
          return;
        }
        if (data != undefined) {
          if (this.showSubSelect === 'ORG_UNIT') {
            this.thirdSelectMenu = data.map(item => ({value: item.id, label: item.code}));
          } else {
            this.code = data.map(item => ({value: item.id, label: item.code}));
            this.newSequenceForm.controls['code'].enable();
          }
        }
      }
    );

    this.store.select('orgUnitCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('ORG unit API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.code = data.map(item => ({value: item.id, label: item.code}));
          this.newSequenceForm.controls['code'].enable();
        }
      }
    );

    this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Card group API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.code = data.map(item => ({value: item.id, label: item.code}));
          this.newSequenceForm.controls['code'].enable();
        }
      }
    );
  }

  switchModal(): void {
    this.modalShowing = !this.modalShowing;
  }

  addSequence(): void {
    this.store.dispatch({type: sequencesActions.SEQUENCES_POST_REQUEST, payload: this.newSequence});
    this.newSequence = fillSequence();
    this.showSubSelect = null;
    this.subSelectValue = null;
    this.thirdSelectValue = null;
    this.newSequenceForm.reset();
    this.newSequenceForm.controls['code'].disable();
    this.switchModal();
  }

  changeResource(resource: string): void {
    this.newSequence.pk.resource = resource;
    this.newSequenceForm.controls['code'].disable();
    this.newSequence.pk.resourceId = null;
    this.showSubSelect = null;

    switch (resource) {

      case 'ISSUER' :
        this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
        break;

      case 'CARD_GROUP' :
        this.showSubSelect = resource;
        this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
        break;

      case 'NETWORK' :
        this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
        break;

      case 'MERCHANT' :
        this.showSubSelect = resource;
        this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
        break;

      case 'ORG_UNIT' :
        this.showSubSelect = resource;
        this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
        break;

      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  subMenuSelect(resource: number): void {
    this.subSelectValue = resource;

    if (this.showSubSelect === 'MERCHANT' || this.showSubSelect === 'ORG_UNIT') {
      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: resource});
    } else {
      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: resource});
    }
  }

  thirdMenuSelect(resource: number): void {
    this.thirdSelectValue = resource;
    this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: resource});
  }

  editing(row: any): void {
    this.edit = row.$$index;
    this.editTemplate = row.template;
    this.editOrder = row.order;
  }

  clearEdit(): void {
    this.edit = null;
    this.editOrder = null;
    this.editTemplate = '';
  }

  changeSequence(row: any): void {
    this.store.dispatch({type: sequencesActions.SEQUENCES_PUT_REQUEST, payload: this.mapSequence(row, true)});
    this.clearEdit();
  }

  showDeleteModal(row: any): void {
    this.warnModalVisible = true;
    this.deletingRow = row;
  }

  deleteRow(): void {
    this.store.dispatch({type: sequencesActions.SEQUENCES_DELETE_REQUEST, payload: this.mapSequence(this.deletingRow, false)});
  }

  mapSequence(input: any, edit?: boolean): SequencesModel {
    return {
      order: edit ? this.editOrder : input.order,
      template: edit ? this.editTemplate : input.template,
      pk: {
        resource: input.resource,
        resourceId: input.resourceId,
        type: input.type
      }
    };
  }

  changeLimit(limit: number): void {
    this.rowLimit = limit;

    setTimeout(
      () => {
        this.table.recalculate();
      },
      0
    );
  }
}
