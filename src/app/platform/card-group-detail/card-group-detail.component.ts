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

@Component({
  selector: 'mss-card-group-detail',
  templateUrl: './card-group-detail.component.html',
  styleUrls: ['./card-group-detail.component.scss']
})
export class CardGroupDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  cardGroupDetail: CardGroupModel;
  tabsOptions: SelectItem[] = [];
  CardGroupSections = CardGroupSections;
  visibleTab: SelectItem;
  stateOptions: SelectItem[] = [{value: 'ENABLED'}, {value: 'DISABLED'}];
  limitOptions: SelectItem[] = [{value: 'ENABLED'}];
  taxTypes: SelectItem[] = [];
  editForm: FormGroup;
  edit = false;
  modalVisible = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private store: Store<AppStateModel>,
              private langService: LanguageService) {
    this.route.params.subscribe(
      (params: { id: string }) => {
        this.store.dispatch({type: cardGroupDetailActions.CARD_GROUP_DETAIL_GET_REQUEST, payload: params.id});
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
}
