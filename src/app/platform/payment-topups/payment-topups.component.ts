import { Component } from '@angular/core';
import { PaymentTopupsModel, PaymentTopupsPredicateObject } from '../../shared/models/payment-topups.model';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ApiService } from '../../shared/services/api.service';
import { paymentTopupsActions } from '../../shared/reducers/payment-topups.reducer';
import { StateModel } from '../../shared/models/state.model';
import { UnsubscribeSubject } from '../../shared/utils';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AppConfigService } from '../../shared/services/app-config.service';

const PAYMENT_TOPUPS_ROUTE = 'platform/payment-topups';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-payment-topups',
  templateUrl: './payment-topups.component.html',
  styleUrls: ['./payment-topups.component.scss']
})
export class PaymentTopupsComponent {

  private unsubscribe$ = new UnsubscribeSubject();

  paymentTopup: PaymentTopupsModel[] = [];
  paymentData: Pagination<PaymentTopupsModel>;
  loading: boolean;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  dateFormat = 'DD.MM.YYYY';

  constructor(private store: Store<AppStateModel>,
              private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private configService: AppConfigService) {

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.store.dispatch({type: paymentTopupsActions.TOPUPS_GET_REQUEST, payload: this.requestModel});
      }
    );

    this.configService.get('dateFormat').subscribe(
      format => this.dateFormat = format
    );

    this.store.select('paymentTopups').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Pagination<PaymentTopupsModel>>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(`Error occurred while getting payment topups from api.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.paymentTopup = data.data.content;
          this.paymentData = data.data;
        }
      }
    );
  }

  changeLimit(limit: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([PAYMENT_TOPUPS_ROUTE, routeParams]);
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${PAYMENT_TOPUPS_ROUTE}`, routeParams]);
  }

  get requestModel(): RequestOptions<PaymentTopupsPredicateObject> {
    return {
      pagination: {
        number: 10,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: {}
      },
      sort: {},
    };
  }

  getFormatedDate(date: Date | string): string {
    return moment(date).format(this.dateFormat);
  }

  onSelect(select: { selected: PaymentTopupsModel[] }): void {
    this.router.navigate([`${PAYMENT_TOPUPS_ROUTE}/${select.selected[0].uuid}`]);
  }

}
