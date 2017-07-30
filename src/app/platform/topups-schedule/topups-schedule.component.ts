import { Component, OnDestroy } from '@angular/core';
import { UnsubscribeSubject } from '../../shared/utils';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TopupsScheduleModel, TopupsSchedulePredicateObject } from '../../shared/models/topups-schedule.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { topupsScheduleActions } from '../../shared/reducers/topups-schedule.reducer';
import { StateModel } from '../../shared/models/state.model';

const TOPUPS_SCHEDULE_ROUTE = 'platform/topups-schedule';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-topups-schedule-list',
  templateUrl: './topups-schedule.component.html',
  styleUrls: ['./topups-schedule.component.scss']
})
export class TopupsScheduleComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  loading = false;

  tableData: Pagination<TopupsScheduleModel>;
  rows: TopupsScheduleModel[] = [];
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private route: ActivatedRoute) {

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getTopupsScheduleList();
      }
    );


    this.store.select('topupsSchedule').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<TopupsScheduleModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Topups schedule API call has returned an error', error);
          return;
        }

        if (data != null && !loading) {
          this.tableData = data;
          this.rows = data.content;
        }
      }
    );
  }

  get requestModel(): RequestOptions<TopupsSchedulePredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: {
          // TODO
        }
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${TOPUPS_SCHEDULE_ROUTE}`, routeParams]);
  }

  changeLimit(limit: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([TOPUPS_SCHEDULE_ROUTE, routeParams]);
  }

  getTopupsScheduleList(): void {
    this.store.dispatch({type: topupsScheduleActions.TOPUPS_SCHEDULE_API_GET, payload: this.requestModel});
  }

  getSortedTopupsScheduleList(sortInfo: any): void {
    this.sortOption = {
      predicate: sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc'
    };
    this.getTopupsScheduleList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
