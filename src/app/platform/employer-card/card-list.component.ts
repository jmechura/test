import { Component, OnDestroy, ViewChild } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
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

const DEFAULT_SEARCH_OBJECT: CardPredicateObject = {
  cardGroupCode: '',
  cln: '',
  issuerCode: '',
  lastname: '',
  state: 'INIT'
};

@Component({
  selector: 'mss-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})

export class CardListComponent implements OnDestroy {

  rows: any[] = [];
  loading = false;
  tableData: Pagination<Card>;
  issuerCodes: SelectItem[] = [];
  requestModel: RequestOptions<CardPredicateObject> = {
    pagination: {
      number: 10,
      numberOfPages: 0,
      start: 0
    },
    search: {
      predicateObject: Object.assign({}, DEFAULT_SEARCH_OBJECT)
    },
    sort: {}
  };
  editingRow = -1;
  editedCard: Card;
  cardStates: SelectItem[] = [];
  cardGroupCodes: SelectItem[] = [];
  issuer = false;
  private unsubscribe$ = new UnsubscribeSubject();
  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;
  cardFilterSection = CardFilterSections;
  issuerTab = false;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private api: ApiService,
              private language: LanguageService,
              private router: Router,
              private roles: RoleService,
              private toastr: ExtendedToastrService) {
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
          this.cardStates = [{value: 'INIT'}, ...data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.cardStates.${item}`)
          }))];
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
          this.issuerCodes = data.map(item => ({value: item.id, label: item.code}));
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
                this.issuerTab = true;
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('cards.cardGroupCodeSelect').subscribe(
                  cardGroupCodeResult => {
                    if (cardGroupCodeResult) {
                      this.issuerTab = true;
                      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: data.resourceId});
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
          this.cardGroupCodes = data.data.map(item => ({value: item.name}));
        }
      }
    );

    this.getCards();
  }

  setPage(pageInfo: any): void {
    this.requestModel.pagination.start = pageInfo.offset * this.requestModel.pagination.number;
    this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.requestModel});
  }

  changeLimit(limit: number): void {
    if (this.requestModel.pagination.number !== limit) {
      this.requestModel.pagination.number = limit;
      this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.requestModel});
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
    this.requestModel.search.predicateObject = Object.assign({}, DEFAULT_SEARCH_OBJECT);
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
    this.requestModel.search.predicateObject.issuerCode = id;
    // clear it before new data arrives
    this.cardGroupCodes = [];
    if (id != null) {
      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: id});
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  getFormatedExpiration(date: string): string {
    return (date != null && date.length > 0) ? `${date.slice(0, 2)}/${date.slice(2, 4)}` :  '';
  }
}
