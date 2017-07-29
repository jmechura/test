import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UnsubscribeSubject } from '../../shared/utils';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { paymentTopupsDetailActions } from '../../shared/reducers/payment-topups-detail.reducer';
import { PaymentTopupsModel } from '../../shared/models/payment-topups.model';
import { StateModel } from '../../shared/models/state.model';
import * as moment from 'moment';
import { AppConfigService } from '../../shared/services/app-config.service';

@Component({
  selector: 'mss-payment-topups-detail',
  templateUrl: './payment-topups-detail.component.html',
  styleUrls: ['./payment-topups-detail.component.scss']
})
export class PaymentTopupsDetailComponent {

  private unsubscribe$ = new UnsubscribeSubject();
  paymentTopup: PaymentTopupsModel;
  isEditing = false;
  dateFormat = 'DD. MM. YYYY';

  constructor(private route: ActivatedRoute,
              private store: Store<AppStateModel>,
              private configService: AppConfigService) {

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: Params) => {
        this.store.dispatch({type: paymentTopupsDetailActions.TOPUPS_DETAIL_GET_REQUEST, payload: params.id});
      }
    );

    this.configService.get('dateFormat').subscribe(
      format => this.dateFormat = format
    );

    this.store.select('paymentTopupsDetail').takeUntil(this.unsubscribe$).subscribe(
      ({data, loading, error}: StateModel<PaymentTopupsModel>) => {
        if (error) {
          console.error('Payment topups detail API call has returned error', error);
          return;
        }

        if (data != null && !loading) {
          this.paymentTopup = data;
        }
      }
    );
  }

  getFormatedDate(date: Date | string): string {
    return moment(date).format(this.dateFormat);
  }
}
