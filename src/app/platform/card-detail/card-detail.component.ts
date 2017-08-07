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
import { Transfer } from '../../shared/models/transfer.model';
import { transfersActions } from '../../shared/reducers/transfers.reducer';
import { Pagination } from '../../shared/models/pagination.model';
import * as moment from 'moment';
import { AppConfigService } from 'app/shared/services/app-config.service';
import { RoleService } from '../../shared/services/role.service';

interface InfoModel {
  label: string;
  value: any;
  formName?: string;
  options?: SelectItem[];
}

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  cardData: CardDetailModel;

  accountOptions: SelectItem[] = [];
  selectedAccountData: Pagination<Transfer>;
  dateFormat = 'DD. MM. YYYY';

  cardForm: FormGroup;

  detailOptions: SelectItem[] = [
    {value: 'Basic', label: this.langService.translate('cards.cardDetail.sections.BASIC')},
    {value: 'Owner', label: this.langService.translate('cards.cardDetail.sections.OWNER')},
    {value: 'Account', label: this.langService.translate('cards.cardDetail.sections.ACCOUNT')},
  ];
  selectedOption = this.detailOptions[0];
  selectedAccountOption: SelectItem = null;

  basicInfo: InfoModel[][];
  ownerInfo: InfoModel[][];

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  loading = true;

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;

  stateSelect: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private langService: LanguageService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private roles: RoleService,
              private configService: AppConfigService) {

    this.configService.get('dateFormat').subscribe(
      format => this.dateFormat = format
    );

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
          this.selectedAccountOption = this.accountOptions[0];

          this.roles.isVisible('accounts.read').subscribe(
            result => {
              if (result) {
                this.store.dispatch({
                  type: transfersActions.TRANSFERS_GET_REQUEST, payload: {
                    predicatedObject: this.requestModel,
                    uuid: this.cardData.accounts[0].uuid,
                    type: 'CARD'
                  }
                });
              } else {
                this.detailOptions = this.detailOptions.filter(opt => opt.value !== 'Account');
              }
            }
          );

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

    this.store.select('transfers').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Pagination<Transfer>>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error('Error occurred while retrieving card detail.', data.error);
          return;
        }
        if (data.data != undefined && !data.loading) {
          this.selectedAccountData = data.data;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  setSelectedOption(newIndex: SelectItem): void {
    this.selectedOption = newIndex;
  }

  setSelectedAccountOption(item: SelectItem): void {
    this.selectedAccountOption = item;
    this.pageNumber = 0;
    this.getTransfers();
  }

  get requestModel(): any {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber) * this.rowLimit,
      },
      search: {},
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  getTransfers(): void {
    const uuid = this.selectedAccountOption.value;
    const account = this.cardData.accounts.find((element) => element.uuid === uuid);
    this.store.dispatch({
      type: transfersActions.TRANSFERS_GET_REQUEST, payload: {
        predicatedObject: this.requestModel,
        uuid: account.uuid,
        type: 'CARD'
      }
    });
  }

  getSortedTransfers(sortInfo: any): void {
    this.sortOption = {
      predicate: sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc'
    };
    this.getTransfers();
  }

  setPage(pageInfo: { offset: number }): void {
    this.pageNumber = pageInfo.offset;
    this.getTransfers();
  }

  changeLimit(limit: number): void {
    this.rowLimit = limit;
    this.getTransfers();
  }

  getFormatedDate(date: Date | string): string {
    return moment(date).format(this.dateFormat);
  }
}
