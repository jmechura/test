import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncryptPinBlockService, IEncryptedPinBlock, IEncryptPinBlockModel } from '../../shared/services/crypto-service';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { StateModel } from '../../shared/models/state.model';
import { CardDetailModel } from '../../shared/models/card-detail.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { cardDetailActions } from '../../shared/reducers/card-detail.reducer';
import { ApiService } from '../../shared/services/api.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { LanguageService } from '../../shared/services/language.service';
import { Pagination } from '../../shared/models/pagination.model';
import { Transfer } from '../../shared/models/transfer.model';
import { transfersActions } from '../../shared/reducers/transfers.reducer';
import { RoleService } from '../../shared/services/role.service';
import { AppConfigService } from '../../shared/services/app-config.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

interface PinblocKeyModel {
  alg: string;
  e: string;
  ext: boolean;
  key_ops: string[];
  kty: string;
  n: string;
}

@Component({
  selector: 'mss-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss'],
  providers: [EncryptPinBlockService]
})

export class CardViewComponent implements OnDestroy {

  card: CardDetailModel;

  cardStatusChangeVisible = false;
  cardPinChangeVisible = false;
  cardForm: FormGroup;
  encryptModel: IEncryptPinBlockModel = {
    pin: '',
    pan: '',
    rsaPublicKey: {
      algorithm: {
        name: ''
      },
      extractable: false,
      type: '',
      usages: [],
    }
  };
  private unsubscribe$ = new UnsubscribeSubject();

  tabsOptions: SelectItem[] = [
    {value: 'BASIC', label: this.language.translate('cards.cardDetail.sections.BASIC')},
    {value: 'ACCOUNT', label: this.language.translate('cards.cardDetail.sections.ACCOUNT')},
    {value: 'PIN', label: this.language.translate('cards.cardDetail.sections.PIN')}
  ];
  visibleTab = this.tabsOptions[0];

  accountOptions: SelectItem[] = [];
  selectedAccountOption: SelectItem;
  transferLoading = false;
  transferRows: any[] = [];

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;

  dateFormat = 'DD. MM. YYYY';

  constructor(private fb: FormBuilder,
              private crypto: EncryptPinBlockService,
              private store: Store<AppStateModel>,
              private api: ApiService,
              private roles: RoleService,
              private route: ActivatedRoute,
              private configService: AppConfigService,
              private language: LanguageService,
              private toastr: ExtendedToastrService) {

    this.configService.get('dateFormat').subscribe(
      format => this.dateFormat = format
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: { uuid: string }) => {
        // BANCIBO ONLY FIX, OTHER PORTALS SHOULD HAVE LIST OF CARD VISIBLE -> DETAIL
        if (!params.uuid) {
          this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
            ({data, error, loading}: StateModel<ProfileModel>) => {
              if (error instanceof MissingTokenResponse) {
                return;
              }

              if (error) {
                console.error('Error occurred while getting profile', error);
                return;
              }

              if (data != null && !loading) {
                this.store.dispatch({type: cardDetailActions.CARD_DETAIL_GET_REQUEST, payload: data.cardUuid});
              }
            }
          );
        } else {
          // REDIRECTED FROM LIST, USE ITS ID
          this.store.dispatch({type: cardDetailActions.CARD_DETAIL_GET_REQUEST, payload: params.uuid});
        }
      }
    );

    this.store.select('cardDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CardDetailModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card detail.', data.error);
          return;
        }
        if (data.data != undefined && !data.loading) {
          this.card = data.data;
          this.encryptModel.pan = data.data.card.cln;
          if (this.card.accounts.length > 0) {
            this.roles.isVisible('accounts.read').subscribe(
              result => {
                if (result) {
                  this.store.dispatch({
                    type: transfersActions.TRANSFERS_GET_REQUEST, payload: {
                      predicatedObject: this.requestModel,
                      uuid: this.card.accounts[0].uuid,
                      type: 'CARD'
                    }
                  });
                  this.accountOptions = this.card.accounts.map(
                    account => ({
                      value: account.uuid,
                      label: `${account.name} - ${account.type}`
                    })
                  );
                  this.selectedAccountOption = this.accountOptions[0];
                } else {
                  this.tabsOptions = this.tabsOptions.filter(opt => opt.value !== 'ACCOUNT');
                }
              }
            );
          }
        }
      }
    );

    this.store.select('transfers').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Pagination<Transfer>>) => {
        this.transferLoading = data.loading;
        if (data.error) {
          console.error('Error occurred while retrieving card detail.', data.error);
          return;
        }
        if (data.data != undefined && !data.loading) {
          this.transferRows = data.data.content.map(item => item);
          this.totalItems = data.data.totalElements;
        }
      }
    );

    this.api.get('/cards/pinblock/key').subscribe(
      (data: PinblocKeyModel) => {
        this.crypto.importPublicKey(data).then(rsa =>
          this.encryptModel.rsaPublicKey = rsa
        );
      },
      error => {
        console.error('Error occurred while getting RSA key', error);
      }
    );

    this.cardForm = this.fb.group({
      newPin: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      confirmPin: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });
  }

  get disabledChange(): boolean {
    return this.cardForm.invalid ||
      !this.cardForm.get('newPin').touched ||
      (this.cardForm.get('newPin').value !== this.cardForm.get('confirmPin').value);
  }

  toggleStatusChange(): void {
    this.cardStatusChangeVisible = !this.cardStatusChangeVisible;
  }

  changePin(): void {
    this.encryptModel.pin = this.cardForm.get('newPin').value;
    this.crypto.encryptPinBlock(this.encryptModel).then((pinBlock: IEncryptedPinBlock) =>
      this.api
        .post('/cards/changepin', {aesKey: pinBlock.aesKeyHex, pinBlock: pinBlock.pinBlockHex, cardUuid: this.card.card.cardUuid})
        .subscribe(
          () => {
            this.toastr.success('toastr.success.changePin');
            this.toggleCardPin();
          },
          err => {
            this.toastr.error(err);
            console.error('Error occurred while changing pin');
          }
        )
    );
  }

  toggleCardStatus(): void {
    const state = this.card.card.state === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    this.api.post('/cards/state', {state, uuid: this.card.card.cardUuid}).subscribe(
      () => {
        this.toastr.success('toastr.success.changeCardStatus');
        this.store.dispatch({type: cardDetailActions.CARD_DETAIL_GET_REQUEST, payload: this.card.card.cardUuid});
        this.toggleStatusChange();
      },
      err => {
        this.toastr.error(err);
        console.error('Error occurred while changing card status');
        this.toggleStatusChange();
      }
    );
  }

  toggleCardPin(): void {
    this.cardPinChangeVisible = !this.cardPinChangeVisible;
  }

  getFormattedDate(date: Date | string): string {
    return moment(date).format(this.dateFormat);
  }

  setSelectedAccountOption(item: SelectItem): void {
    this.selectedAccountOption = item;
    this.pageNumber = 0;
    this.getTransfers();
  }

  getTransfers(): void {
    const uuid = this.selectedAccountOption.value;
    const account = this.card.accounts.find((element) => element.uuid === uuid);
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

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
