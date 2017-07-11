import { Component, OnDestroy, ViewChild } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { cardActions } from '../../shared/reducers/card.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { Card, CardPredicateObject } from '../../shared/models/card.model';
import { ApiService } from '../../shared/services/api.service';
import { cardStateActions } from '../../shared/reducers/card-state.reducer';
import { AccountModel } from '../../shared/models/account.model';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { Router } from '@angular/router';
import { CodeModel } from '../../shared/models/code.model';

const DEFAULT_SEARCH_OBJECT: CardPredicateObject = {
  cardGroupCode: '',
  cln: '',
  issuerCode: 'bancibo',
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
  payload: RequestOptions<CardPredicateObject> = {
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
  cardGroupCodes: SelectItem[] = [{value: 'something'}];
  issuer = false;
  private unsubscribe$ = new Subject<void>();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private store: Store<AppState>, private api: ApiService, private router: Router) {
    this.store.dispatch({type: cardStateActions.CARD_STATE_GET_REQUEST});

    this.store.select('cardStates').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card states.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.cardStates = [{value: 'INIT'}, ...data.data.map(item => ({value: item}))];
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
          this.rows = data.content.map(item => (
            {
              cardUuid: item.cardUuid,
              jmeno: `${item.firstname} ${item.lastname}`,
              status: item.state,
              platnost: item.expiryDate,
              cln: item.cln,
              processRequest: item.processRequest
            }
          ));
        }
      }
    );

    this.store.select('account').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<AccountModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving account', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          // TODO: activate after valid issuer code is got from API and if its role is issuer
          // this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: data.data.issuerCode});
          this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: 'bancibo'});
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
          this.cardGroupCodes = data.data.map(item => ({value: item.code}));
        }
      }
    );
  }

  setPage(pageInfo: any): void {
    this.payload.pagination.start = pageInfo.offset * this.payload.pagination.number;
    this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});
  }

  changeLimit(limit: number): void {
    if (this.payload.pagination.number !== limit) {
      this.payload.pagination.number = limit;
      this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});
    }
  }

  sendRequest(row: any, event: MouseEvent): void {
    event.preventDefault();
    // dont send request if it has been already sent
    if (row.processRequest) {
      return;
    }
    this.api.post('/cards/requests', {cardUuid: row.cardUuid, confirm: true}).subscribe(
      () => {
        this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});
      },
      error => {
        console.error('Error occurred while sending card request', error);
      }
    );
  }

  clearFilter(): void {
    this.payload.search.predicateObject = Object.assign({}, DEFAULT_SEARCH_OBJECT);
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
        this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});
      },
      error => {
        console.error('Error occured while changing card state', error);
      }
    );
  }

  getCards(): void {
    const search = Object.keys(this.payload.search.predicateObject)
      .filter(key => this.payload.search.predicateObject[key].length > 0)
      .reduce(
        (acc, item) => {
          acc[item] = this.payload.search.predicateObject[item];
          return acc;
        },
        {}
      );
    this.store.dispatch({
      type: cardActions.CARD_API_GET,
      payload: Object.assign(this.payload, {search: {predicateObject: search}})
    });
  }

  goToDetail(event: any): void {
    this.router.navigateByUrl(`platform/employer-card/${event.row.cardUuid}`);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
