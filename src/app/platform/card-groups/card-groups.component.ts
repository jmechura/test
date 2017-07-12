import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { cardGroupActions, CardGroupState } from '../../shared/reducers/card-group.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { CardGroupModel, CardGroupSearchModel } from '../../shared/models/card-group.model';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { StateModel } from '../../shared/models/state.model';
import { CodeModel } from '../../shared/models/code.model';
import { AccountModel } from '../../shared/models/account.model';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { optionalEmailValidator } from 'app/shared/validators/optional-email.validator';
import { Router } from '@angular/router';
import { CardGroupSections } from '../../shared/enums/card-group-sections.enum';
import { taxTypeActions } from '../../shared/reducers/tax-types.reducer';
import { LanguageService } from '../../shared/language/language.service';

@Component({
  selector: 'mss-card-groups',
  templateUrl: './card-groups.component.html',
  styleUrls: ['./card-groups.component.scss']
})
export class CardGroupsComponent implements OnDestroy {

  unsubscribe$ = new Subject<void>();
  requestModel: RequestOptions<CardGroupSearchModel> = {
    pagination: {
      number: 10,
      numberOfPages: 0,
      start: 0
    },
    search: {
      predicateObject: {}
    },
    sort: {}
  };

  issuerCodes: SelectItem[] = [];
  userIssuerCode: string;
  cardGroupCodes: SelectItem[] = [];
  tableData: Pagination<CardGroupModel>;
  loading = false;
  rows: any[] = [];
  filterForm: FormGroup;
  newCardGroupForm: FormGroup;
  modalVisible = false;
  tabsOptions = [
    {
      label: 'základní',
      value: CardGroupSections.BASIC
    },
    {
      label: 'limity',
      value: CardGroupSections.LIMITS
    },
    {
      label: 'kontakt',
      value: CardGroupSections.CONTACTS
    },
    {
      label: 'adresa',
      value: CardGroupSections.ADDRESS
    }
  ];
  CardGroupSections = CardGroupSections;
  visibleTab = this.tabsOptions[0];
  states: SelectItem[] = [{value: 'ENABLED'}];
  taxTypes: SelectItem[] = [];


  constructor(private store: Store<AppState>,
              private fb: FormBuilder,
              private api: ApiService,
              private language: LanguageService,
              private router: Router) {
    this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
    this.store.dispatch({type: taxTypeActions.TAX_TYPES_GET_REQUEST});
    this.store.select('cardGroups').takeUntil(this.unsubscribe$).subscribe(
      (data: CardGroupState) => {
        if (data.error) {
          console.error('Error occured while retrieving card groups data from api.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.tableData = data.data;
          this.rows = data.data.content.map(item => (
            {
              id: item.id,
              name: item.name,
              code: item.code,
              issuerCode: item.issuerCode,
              state: item.state
            }
          ));
        }
      }
    );

    this.store.select('account').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<AccountModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving account information.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          // TODO: edit this after issuer code is got from account model and role system works
          // TODO: issuer code select in filter and createNew should be visible only to SA, others should use their issuerCode
          this.userIssuerCode = data.data.issuerCode;
          this.userIssuerCode = 'bancibo';
          this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: this.userIssuerCode});
        }
      }
    );

    // TODO: this is useless unless user is SA
    this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving issuer codes.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.issuerCodes = data.data.map(code => ({value: code.id, label: code.code}));
        }
      }
    );

    this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card group codes.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.cardGroupCodes = data.data.map(code => ({value: code.code}));
        }
      }
    );

    this.store.select('taxTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving tax types.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.taxTypes = data.data.map(item => ({value: item}));
        }
      }
    );

    this.filterForm = fb.group(
      {
        issuerCode: [''],
        cardGroupCode: [''],
        name: ['']
      }
    );

    this.newCardGroupForm = fb.group(
      {
        name: ['', Validators.required],
        code: ['', Validators.required],
        externalCode: [''],
        issuerCode: ['', Validators.required],
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
        createSpecSymbol: [false],
        specificSymbol: [''],
        taxType: ['UNKNOWN'],
        taxValue: [0],
        createDefaultDeliveryAddress: [false],
        street: [''],
        city: [''],
        zip: ['']
      }
    );

    this.tabsOptions = Object.keys(CardGroupSections).filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`cardGroups.sections.${item}`),
        value: CardGroupSections[item]
      }));
    this.visibleTab = this.tabsOptions[0];
  }


  getCardGroups(): void {
    this.store.dispatch(
      {
        type: cardGroupActions.CARD_GROUPS_GET_REQUEST,
        payload: Object.assign({}, this.requestModel, {search: {predicateObject: this.filterForm.value}})
      }
    );
  }

  getSortedCardGroups(sortInfo: any): void {
    this.requestModel.sort = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getCardGroups();
  }

  changeLimit(limit: number): void {
    if (limit !== this.requestModel.pagination.number) {
      this.requestModel.pagination.number = limit;
      this.getCardGroups();
    }
  }

  setPage(pageInfo: any): void {
    this.requestModel.pagination.start = pageInfo.offset * this.requestModel.pagination.number;
    this.getCardGroups();
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  addCardGroup(): void {
    this.modalVisible = true;
  }

  isInvalid(value: string): boolean {
    const item = this.newCardGroupForm.get(value);
    return item.touched && item.invalid;
  }

  createNewCardGroup(): void {
    this.api.post('/cardgroups', this.newCardGroupForm.value).subscribe(
      () => {
        this.modalVisible = false;
        this.getCardGroups();
      },
      (error) => {
        console.error('data', error);
      }
    );
  }

  goToDetail(item: any): void {
    this.router.navigateByUrl(`platform/card-groups/${item.row.id}`);
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
