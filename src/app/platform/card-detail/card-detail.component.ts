import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { CardDetailModel } from '../../shared/models/card-detail.model';
import { cardDetailActions } from '../../shared/reducers/card-detail.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';

@Component({
  selector: 'mss-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  cardData: CardDetailModel;
  viewData: {
    basic: any[];
    owner: any[];
  };

  accountOptions: SelectItem[] = [];
  selectedAccountName;
  selectedAccount: any;

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params) => {
        this.store.dispatch({type: cardDetailActions.CARD_DETAIL_GET_REQUEST, payload: params.uuid});
      }
    );
    this.store.select('cardDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CardDetailModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card detail.', data.error);
          return;
        }
        if (data.data != undefined && !data.loading) {
          this.cardData = data.data;
          this.viewData = this.createViewData(this.cardData);
          this.accountOptions = this.cardData.accounts.map(account => ({value: account.uuid}));
        }
      }
    );
  }

  setAccount(value: string): void {
    this.selectedAccountName = value;
    const acc = this.cardData.accounts.find(account => account.type === value);
    this.selectedAccount = {
      list: [
        {
          value: acc.balance,
          label: 'Balance'
        },
        {
          value: acc.type,
          label: 'Type'
        },
        {
          value: acc.uuid,
          label: 'UUID'
        }
      ],
      tableData: acc.transfers
    };
  }

  createViewData(data: CardDetailModel): any {
    return {
      basic: [
        {
          label: 'UUID',
          value: data.card.cardUuid
        },
        {
          label: 'CLN',
          value: data.card.cln
        },
        {
          label: 'PAN',
          value: data.card.panSequenceNumber
        },
        {
          label: 'Expiration',
          value: data.card.expiration
        },
        {
          label: 'Expiration Date',
          value: data.card.expiryDate
        },
        {
          label: 'Service Code',
          value: data.card.serviceCode
        },
        {
          label: 'Type',
          value: data.card.type
        },
        {
          label: 'State',
          value: data.card.state
        },
        {
          label: 'Track2',
          value: data.card.track2
        }
      ],
      owner: [
        {
          label: 'First Name',
          value: data.card.firstname
        },
        {
          label: 'Last Name',
          value: data.card.lastname
        },
        {
          label: 'Limit',
          value: data.card.limit
        },
        {
          label: 'Limit Type',
          value: data.card.limitType
        },
        {
          label: 'Card Group',
          value: data.card.cardGroupPrimaryCode
        },
        {
          label: 'Issuer Code',
          value: data.card.issuerCode
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
