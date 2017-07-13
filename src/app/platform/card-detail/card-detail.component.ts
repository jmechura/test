import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { StateModel } from '../../shared/models/state.model';
import { CardDetailModel } from '../../shared/models/card-detail.model';
import { cardDetailActions } from '../../shared/reducers/card-detail.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/language/language.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'mss-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  cardData: CardDetailModel;
  viewData: {
    basic: any[];
    owner: any[];
  };

  rowLimit = 10;
  accountOptions: SelectItem[] = [];
  selectedAccountName;
  selectedAccount: any;

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private language: LanguageService,
              private route: ActivatedRoute) {

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
          label: this.language.translate(`cards.cardDetail.account.balance`)
        },
        {
          value: acc.type,
          label: this.language.translate(`dictionary.type`)
        },
        {
          value: acc.uuid,
          label: this.language.translate(`dictionary.uuid`)
        }
      ],
      tableData: acc.transfers
    };
  }

  createViewData(data: CardDetailModel): any {
    return {
      basic: [
        {
          label: this.language.translate(`dictionary.uuid`),
          value: data.card.cardUuid
        },
        {
          label: this.language.translate(`dictionary.cln`),
          value: data.card.cln
        },
        {
          label: this.language.translate(`dictionary.pan`),
          value: data.card.panSequenceNumber
        },
        {
          label: this.language.translate(`dictionary.expiration`),
          value: data.card.expiration
        },
        {
          label: this.language.translate(`cards.cardDetail.expirationDate`),
          value: data.card.expiryDate
        },
        {
          label: this.language.translate(`dictionary.serviceCode`),
          value: data.card.serviceCode
        },
        {
          label: this.language.translate(`dictionary.typeOfCard`),
          value: data.card.type
        },
        {
          label: this.language.translate(`dictionary.state`),
          value: data.card.state
        },
        {
          label: this.language.translate(`cards.cardDetail.track2`),
          value: data.card.track2
        }
      ],
      owner: [
        {
          label: this.language.translate(`basic.firstName`),
          value: data.card.firstname
        },
        {
          label: this.language.translate(`basic.lastName`),
          value: data.card.lastname
        },
        {
          label: this.language.translate(`dictionary.limit`),
          value: data.card.limit
        },
        {
          label: this.language.translate(`dictionary.limitType`),
          value: data.card.limitType
        },
        {
          label: this.language.translate(`dictionary.cardGroupCode`),
          value: data.card.cardGroupPrimaryCode
        },
        {
          label: this.language.translate(`dictionary.issuerCode`),
          value: data.card.issuerCode
        }
      ]
    };
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
    this.unsubscribe$.fire();
  }
}
