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

@Component({
  selector: 'mss-employer-card',
  templateUrl: './employer-card.component.html',
  styleUrls: ['./employer-card.component.scss']
})

export class EmployerCardComponent implements OnDestroy {

  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
  rows: any[];
  rowLimit = 10;
  loading = false;
  tableData: Pagination<Card>;
  payload: RequestOptions<CardPredicateObject> = {
    pagination: {
      number: this.rowLimit,
      numberOfPages: 0,
      start: 0
    },
    search: {
      predicateObject: {
        cardGroupCode: '',
        cln: '',
        issuerCode: '',
        lastname: '',
        state: 'INIT'
      }
    },
    sort: {}
  };
  editingRow = -1;
  editedCard: Card;
  cardStates: SelectItem[] = [];
  private unsubscribe$ = new Subject<void>();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private store: Store<AppState>, private api: ApiService) {
    this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});
    this.store.dispatch({type: cardStateActions.CARD_STATE_GET_REQUEST});

    this.store.select('cardStates').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card states.', data.error);
          return;
        }
        if (data.data != undefined && !data.loading) {
          this.cardStates = data.data.map(item => ({value: item}));
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
  }

  setPage(pageInfo: any): void {
    this.payload.pagination.start = pageInfo.offset;
    this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});
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

  sendRequest(row: any): void {
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

  startEditing(row: any): void {
    this.editedCard = Object.assign({}, this.tableData.content.find(item => item.cardUuid === row.cardUuid));
    this.editingRow = row.$$index;
  }

  cancelEditing(): void {
    this.editingRow = -1;
    this.editedCard = null;
  }

  submitEdit(): void {
    this.editingRow = -1;
    this.api.post('/cards/state', this.editedCard).subscribe(
      () => {
        this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});
      },
      error => {
        console.error('Error occured while changing card state', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
