import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { StateModel } from '../../shared/models/state.model';
import { CardDetailModel } from '../../shared/models/card-detail.model';
import { cardDetailActions } from '../../shared/reducers/card-detail.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';

interface InfoModel {
  label: string;
  value: any;
  formName?: string;
  options?: SelectItem[];
}

@Component({
  selector: 'mss-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  cardData: CardDetailModel;

  rowLimit = 10;
  accountOptions: SelectItem[] = [];
  selectedAccountName;
  selectedAccount: any;

  cardForm: FormGroup;

  detailOptions: SelectItem[] = [
    {value: 'Basic', label: this.langService.translate('cards.cardDetail.sections.BASIC')},
    {value: 'Owner', label: this.langService.translate('cards.cardDetail.sections.OWNER')},
    {value: 'Account', label: this.langService.translate('cards.cardDetail.sections.ACCOUNT')},
  ];
  selectedOption = this.detailOptions[0];

  basicInfo: InfoModel[][];
  ownerInfo: InfoModel[][];

  stateSelect: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private langService: LanguageService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {

    this.cardForm = this.fb.group(
      {
        uuid: ['', Validators.required],
        cln: '',
        pan: '',
        dic: '',
        email: '',
        phone: '',
        bankAccount: '',
        street: '',
        city: '',
        zip: '',
        region: '',
        country: '',
      }
    );

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
          this.cardForm.patchValue(this.cardData);
          this.accountOptions = this.cardData.accounts.map(account => ({value: account.uuid}));
          this.basicInfo = [
            [
              {
                label: this.langService.translate(`dictionary.uuid`),
                value: this.cardData.card.cardUuid,
                formName: 'cardUuid',
              },
              {
                label: this.langService.translate(`dictionary.cln`),
                value: this.cardData.card.cln,
                formName: 'cln',
              },
              {
                label: this.langService.translate(`dictionary.pan`),
                value: this.cardData.card.panSequenceNumber,
                formName: 'panSequenceNumber',
              },
              {
                label: this.langService.translate(`dictionary.expiration`),
                value: this.cardData.card.expiration,
                formName: 'expiration',
              },
              {
                label: this.langService.translate(`cards.cardDetail.expirationDate`),
                value: this.cardData.card.expiryDate,
                formName: 'expiryDate',
              },
            ],
            [
              {
                label: this.langService.translate('dictionary.serviceCode'),
                value: this.cardData.card.serviceCode,
                formName: 'serviceCode',
              },
              {
                label: this.langService.translate('dictionary.typeOfCard'),
                value: this.cardData.card.type,
                formName: 'typeOfCard',
              },
              {
                label: this.langService.translate('dictionary.state'),
                value: this.cardData.card.state,
                formName: 'state',
                options: this.stateSelect
              },
              {
                label: this.langService.translate('cards.cardDetail.track2'),
                value: this.cardData.card.track2,
                formName: 'track2',
              },
            ],
          ];
          this.ownerInfo = [
            [
              {
                label: this.langService.translate('basic.firstName'),
                value: this.cardData.card.firstname,
                formName: 'firstname',
              },
              {
                label: this.langService.translate('basic.lastName'),
                value: this.cardData.card.lastname,
                formName: 'lastname',
              },
              {
                label: this.langService.translate('dictionary.limit'),
                value: this.cardData.card.limit,
                formName: 'limit',
              },
            ],
            [
              {
                label: this.langService.translate('dictionary.limitType'),
                value: this.cardData.card.limitType,
                formName: 'limitType',
              },
              {
                label: this.langService.translate('dictionary.cardGroupCode'),
                value: this.cardData.card.cardGroupPrimaryCode,
                formName: 'cardGroupPrimaryCode',
              },
              {
                label: this.langService.translate('dictionary.issuerCode'),
                value: this.cardData.card.issuerCode,
                formName: 'issuerCode',
              },
            ]
          ];
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
          label: this.langService.translate(`cards.cardDetail.account.balance`)
        },
        {
          value: acc.type,
          label: this.langService.translate(`dictionary.type`)
        },
        {
          value: acc.uuid,
          label: this.langService.translate(`dictionary.uuid`)
        }
      ],
      tableData: acc.transfers
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

  setSelectedOption(newIndex: SelectItem): void {
    this.selectedOption = newIndex;
  }
}
