import { Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { cardActions } from '../../shared/reducers/card.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { Card, CardPredicateObject } from '../../shared/models/card.model';

@Component({
  selector: 'mss-employer-card',
  templateUrl: './employer-card.component.html',
  styleUrls: [
    './employer-card.component.scss',
    '../../shared/components/silver/data-table/data-table.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,

})

export class EmployerCardComponent implements OnDestroy {

  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
  columns = [
    {name: 'Jmeno'},
    {name: 'Status'},
    {name: 'Platnost'},
    {name: 'CLN'}
  ];
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
  private unsubscribe$ = new Subject<void>();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private store: Store<AppState>) {
    this.store.dispatch({type: cardActions.CARD_API_GET, payload: this.payload});

    this.store.select('card').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<Card>>) => {
        this.loading = loading;
        if (error) {
          console.error('Card API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.tableData = data;
          this.rows = data.content.map(item => (
            {
              jmeno: `${item.firstname} ${item.lastname}`,
              status: item.state,
              platnost: item.expiryDate,
              cln: item.cln
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
