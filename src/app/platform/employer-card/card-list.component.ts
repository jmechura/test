import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { StateModel } from '../../shared/models/state.model';
import { cardActions } from '../../shared/reducers/card.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { Card, CardPredicateObject } from '../../shared/models/card.model';
import { ApiService } from '../../shared/services/api.service';
import { cardStateActions } from '../../shared/reducers/card-state.reducer';
import { ProfileModel } from '../../shared/models/profile.model';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { Router } from '@angular/router';
import { CodeModel } from '../../shared/models/code.model';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { RoleService } from '../../shared/services/role.service';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { CardFilterSections } from '../../shared/enums/card-sections.enum';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmbededComponentModel } from '../../shared/models/embeded-component.model';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})

export class CardListComponent implements OnDestroy, OnInit {

  rows: any[] = [];
  loading = false;
  tableData: Pagination<Card>;
  issuerCodes: SelectItem[] = [];
  cardStates: SelectItem[] = [];
  cardGroupCodes: SelectItem[] = [];
  private unsubscribe$ = new UnsubscribeSubject();
  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;
  cardFilterSection = CardFilterSections;
  filterForm: FormGroup;
  editingRow = -1;
  editedCard: Card;
  pageNumber = 0;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  totalItems = 0;
  sortOptions: {
    predicate: string;
    reverse: boolean;
  };
  embeddedObject: EmbededComponentModel;

  @Input()
  set embeded(obj: EmbededComponentModel) {
    this.embeddedObject = obj;
    if (obj.issuerCode) {
      this.filterForm.get('issuerCode').patchValue(obj.issuerCode);
      this.filterForm.get('issuerCode').enable();
      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: obj.issuerId});
    }

    if (obj.cardGroupCode) {
      this.filterForm.get('cardGroupCode').patchValue(obj.cardGroupCode);
      this.filterForm.get('cardGroupCode').enable();
      // all selects are hidden
      this.filterSections = this.filterSections.filter(sect => sect.value !== CardFilterSections.ISSUER);
    }
  }


  constructor(private store: Store<AppStateModel>,
              private api: ApiService,
              private language: LanguageService,
              private router: Router,
              private roles: RoleService,
              private fb: FormBuilder,
              private toastr: ExtendedToastrService) {
    this.filterForm = this.fb.group({
      cardGroupCode: [{value: null, disabled: true}],
      cln: [null],
      issuerCode: [{value: null, disabled: true}],
      lastname: [null],
      state: [{value: null, disabled: true}]
    });

    this.store.dispatch({type: cardStateActions.CARD_STATE_GET_REQUEST});

    this.filterSections = Object.keys(CardFilterSections).filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`cards.cardList.sections.${item}`),
        value: CardFilterSections[item]
      }));
    this.visibleSection = this.filterSections[0];

    this.store.select('cardStates').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card states.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.cardStates = data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.cardStates.${item}`)
          }));
          if (this.cardStates.length > 0) {
            this.filterForm.get('state').enable();
          }
        }
      }
    );

    this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Issuer codes API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          // for issuer code and is are equal, no need to join id and code
          this.issuerCodes = data.map(item => ({value: item.id, label: item.name}));
          if (this.issuerCodes.length > 0) {
            this.filterForm.get('issuerCode').enable();
          }
        }
      }
    );

    this.store.select('card').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<Card>>) => {
        this.loading = loading;
        if (error) {
          console.error('Card API call has returned error', error);
          return;
        }
        if (data != undefined && !loading) {
          this.tableData = data;
          this.rows = data.content.map(item => item);
          this.totalItems = data.totalElements;
        }
      }
    );

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<ProfileModel>) => {
        if (error instanceof MissingTokenResponse) {
          return;
        }

        if (error !== null) {
          console.error('Error occurred while retrieving profile', error);
          return;
        }
        if (data != null && !loading) {
          this.roles.isVisible('cards.issuerCodeSelect').subscribe(
            issuerResult => {
              if (issuerResult) {
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('cards.cardGroupCodeSelect').subscribe(
                  cardGroupCodeResult => {
                    if (cardGroupCodeResult) {
                      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: data.resourceId});
                    } else {
                      this.filterSections = this.filterSections.filter(sect => sect.value !== CardFilterSections.ISSUER);
                    }
                  }
                );
              }
            }
          );
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
          this.cardGroupCodes = data.data.map(item => ({value: item.code, label: item.name}));
          if (this.cardGroupCodes.length > 0) {
            this.filterForm.get('cardGroupCode').enable();
          }
        }
      }
    );
  }

  setPage(pageInfo: any): void {
    this.pageNumber = pageInfo.offset;
    this.getCards();
  }

  changeLimit(limit: number): void {
    if (this.rowLimit !== limit) {
      this.rowLimit = limit;
      this.getCards();
    }
  }

  sendRequest(row: any, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // dont send request if it has been already sent
    if (row.processRequest) {
      return;
    }
    this.api.post('/cards/requests', {cardUuid: row.cardUuid, confirm: true}).subscribe(
      () => {
        this.toastr.success('toastr.success.sendCardRequest');
        this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.requestModel});
      },
      error => {
        this.toastr.error(error);
        console.error('Error occurred while sending card request', error);
      }
    );
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.filterForm.get('cardGroupCode').disable();
    this.cardGroupCodes = [];
  }

  getCards(): void {
    this.store.dispatch({
      type: cardActions.CARD_API_GET,
      payload: this.requestModel
    });
  }

  goToDetail(event: any): void {
    this.router.navigateByUrl(`platform/cards/${event.row.cardUuid}`);
  }

  getSortedCards(sortInfo: any): void {
    sortInfo.sorts[0].prop = (sortInfo.sorts[0].prop === 'cardGroupPrimaryCode') ? 'cardGroupCode' : sortInfo.sorts[0].prop;
    this.requestModel.sort = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getCards();
  }

  selectIssuerCode(id: string): void {
    // clear it before new data arrives
    this.filterForm.get('cardGroupCode').reset();
    this.filterForm.get('cardGroupCode').disable();
    this.cardGroupCodes = [];
    if (id != null) {
      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: id});
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  ngOnInit(): void {
    this.getCards();
  }

  getFormatedExpiration(date: string): string {
    return (date != null && date.length > 0) ? `${date.slice(0, 2)}/${date.slice(2, 4)}` : '';
  }

  startEditing(row: any, event: MouseEvent): void {
    event.stopPropagation();
    this.editedCard = Object.assign({}, this.tableData.content.find(item => item.cardUuid === row.cardUuid));
    this.editingRow = row.$$index;
  }

  cancelEditing(event: MouseEvent): void {
    event.stopPropagation();
    this.editingRow = -1;
    this.editedCard = null;
  }

  submitEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.editingRow = -1;
    this.api.post('/cards/state', {state: this.editedCard.state, uuid: this.editedCard.cardUuid}).subscribe(
      () => {
        this.toastr.success('toastr.success.changeCardStatus');
        this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.requestModel});
      },
      error => {
        this.toastr.error(error);
        console.error('Error occured while changing card state', error);
      }
    );
  }

  private get predicateObject(): CardPredicateObject {
    return this.filterForm.value;
  }

  private get requestModel(): RequestOptions<CardPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: this.pageNumber * this.rowLimit
      },
      search: {
        predicateObject: this.predicateObject
      },
      sort: this.sortOptions ? this.sortOptions : {}
    };
  }
}
