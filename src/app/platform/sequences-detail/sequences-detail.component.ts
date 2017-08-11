import { Component, OnDestroy } from '@angular/core';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { LanguageService } from '../../shared/services/language.service';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { sequencesDetailActions } from '../../shared/reducers/sequences-detail.reducer';
import { UnsubscribeSubject } from '../../shared/utils';
import { StateModel } from '../../shared/models/state.model';
import { SequencesModel } from '../../shared/models/sequences.model';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';
import { SelectItem } from 'app/shared/components/bronze/select/select.component';
import { CodeModel } from '../../shared/models/code.model';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { userResourceActions } from '../../shared/reducers/user-resource.reducer';
import { sequencesTypeActions } from '../../shared/reducers/sequences-type.reducer';

@Component({
  selector: 'mss-sequences-detail',
  templateUrl: './sequences-detail.component.html',
  styleUrls: ['./sequences-detail.component.scss']
})
export class SequencesDetailComponent implements OnDestroy {

  ComponentMode = ComponentMode;
  sequenceState: ComponentMode = ComponentMode.View;
  private unsubscribe$ = new UnsubscribeSubject();
  sequence: SequencesModel;
  sequencesForm: FormGroup;
  showSubSelect: 'MERCHANT' | 'ORG_UNIT' | 'CARD_GROUP';
  subSelectMenu: SelectItem[] = [];
  subSelectValue: number;
  resourceIds: SelectItem[];
  thirdSelectMenu: SelectItem[] = [];
  thirdSelectValue: number;
  sequencesType: SelectItem[] = [];
  userResource: SelectItem[] = [];

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private fb: FormBuilder,
              private api: ApiService,
              private router: Router,
              private toastr: ExtendedToastrService,
              private language: LanguageService) {

    this.sequencesForm = this.fb.group({
      order: ['', Validators.required],
      template: ['', Validators.required],
      pk: this.fb.group({
        resource: ['', Validators.required],
        resourceId: ['', Validators.required],
        type: ['', Validators.required],
      }),
    });

    this.route.params.subscribe(data => {
      if (data.id === 'create') {
        this.sequenceState = ComponentMode.Create;
        this.store.dispatch({type: sequencesTypeActions.SEQUENCES_TYPE_API_GET});
        this.store.dispatch({type: userResourceActions.USER_RESOURCE_GET_REQUEST});
      } else {
        this.store.dispatch({type: sequencesDetailActions.SEQUENCES_DETAIL_GET_REQUEST, payload: data.id.split('-').join('/')});
      }
    });
    this.store.select('sequencesDetail').takeUntil(this.unsubscribe$).subscribe((data: StateModel<SequencesModel>) => {
      if (data.error) {
        console.error(data.error);
        return;
      }
      if (data.data != null && !data.loading && this.sequenceState !== ComponentMode.Create) {
        this.sequence = data.data;
        this.sequencesForm.patchValue(data.data);
      }

    });

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
            this.resourceIds = data.map(item => ({value: item.id, label: item.code}));
            this.sequencesForm.get('pk').get('resourceId').enable();
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
            this.resourceIds = data.map(item => ({value: item.id, label: item.code}));
            this.sequencesForm.get('pk').get('resourceId').enable();
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
            this.resourceIds = data.map(item => ({value: item.id, label: item.code}));
            this.sequencesForm.get('pk').get('resourceId').enable();
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
          this.resourceIds = data.map(item => ({value: item.id, label: item.code}));
          this.sequencesForm.get('pk').get('resourceId').enable();
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
          this.resourceIds = data.map(item => ({value: item.id, label: item.code}));
          this.sequencesForm.get('pk').get('resourceId').enable();
        }
      }
    );
  }

  startEditingSequence(): void {
    this.sequenceState = ComponentMode.Edit;
  }

  saveSequence(): void {
    if (this.sequenceState === ComponentMode.Edit) {
      this.store.dispatch({type: sequencesDetailActions.SEQUENCES_DETAIL_PUT_REQUEST, payload: this.sequencesForm.value});
    }

    if (this.sequenceState === ComponentMode.Create) {
      this.api.post('/sequences', this.sequencesForm.value).subscribe(
        (sequence: SequencesModel) => {
          this.toastr.success('toastr.success.createSequence');
          this.router.navigateByUrl(`platform/sequences/${sequence.pk.type}-${sequence.pk.resource}-${sequence.pk.resourceId}`);
        },
        error => {
          this.toastr.error(error);
          console.error('Create sequence fail', error);
        }
      );
    }
    this.sequenceState = ComponentMode.View;
  }

  dismissSequence(): void {
    if (this.sequenceState === ComponentMode.Create) {
      this.router.navigateByUrl('platform/sequences');
    } else {
      this.sequenceState = ComponentMode.View;
      this.sequencesForm.patchValue(this.sequence);
    }
  }

  isValuePresent(control: FormControl): boolean {
    return control.touched && control.errors != null && control.errors.required;
  }

  changeResource(resource: string): void {
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

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

}
