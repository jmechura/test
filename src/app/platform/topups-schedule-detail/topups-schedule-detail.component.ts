import { Component, OnDestroy } from '@angular/core';
import { UnsubscribeSubject } from '../../shared/utils';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { topupsScheduleDetailActions } from '../../shared/reducers/topups-schedule-detail.reducer';
import { StateModel } from '../../shared/models/state.model';
import { TopupsScheduleModel } from '../../shared/models/topups-schedule.model';
import { TopupScheduleItemState, topupsScheduleItemActions } from '../../shared/reducers/topup-schedule-item.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TopupScheduleItemModel } from '../../shared/models/topup-schedule-item.model';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-topups-schedule-detail',
  templateUrl: './topups-schedule-detail.component.html',
  styleUrls: ['./topups-schedule-detail.component.scss']
})
export class TopupsScheduleDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  sortOptions: {
    predicate: string;
    reverse: boolean;
  };
  scheduleDetail: TopupsScheduleModel;
  tableData: Pagination<TopupScheduleItemModel>;
  itemLoading = false;
  fileName: string;

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 1;
  totalItems = 0;

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>) {
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: Params) => {
        this.fileName = params.filename;
        this.store.dispatch({type: topupsScheduleDetailActions.TOPUPS_SCHEDULE_DETAIL_GET_REQUEST, payload: this.fileName});
        this.getItems();
      }
    );

    this.store.select('topupsScheduleDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<TopupsScheduleModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving topup schedule detail.', data.error);
        }
        if (data.data != undefined && !data.loading) {
          this.scheduleDetail = data.data;
        }
      }
    );

    this.store.select('topupsScheduleItem').takeUntil(this.unsubscribe$).subscribe(
      (data: TopupScheduleItemState) => {
        this.itemLoading = data.loading;
        if (data.error) {
          console.error('Error occurred while retrieving topup schedule items.', data.error);
        }
        if (data.data != undefined && !data.loading) {
          this.tableData = data.data;
          this.totalItems = data.data.totalElements;
        }
      }
    );
  }

  changeLimit(limit: number): void {
    this.pageNumber = 1;
    this.rowLimit = limit;
    this.getItems();
  }

  getItems(): void {
    this.store.dispatch({
      type: topupsScheduleItemActions.TOPUPS_SCHEDULE_ITEM_GET_REQUEST,
      payload: {name: this.fileName, body: this.requestModel}
    });
  }

  getSortedTopupsScheduleItems(sortInfo: any): void {
    this.sortOptions = {
      predicate: sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc'
    };
    this.getItems();
  }


  setPage(pageInfo: { offset: number }): void {
    this.pageNumber = pageInfo.offset + 1;
  }

  private get requestModel(): RequestOptions<any> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit
      },
      search: {},
      sort: this.sortOptions ? this.sortOptions : {}
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

}
