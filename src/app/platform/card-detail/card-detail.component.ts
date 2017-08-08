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

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  loading = false;

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;

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
          this.accountOptions = this.cardData.accounts.map(
            account => ({
              value: account.uuid,
              label: `${account.name} - ${account.type}`
            })
          );
          this.selectedAccountOption = this.accountOptions[0];

          if (this.cardData.accounts.length > 0) {
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
          }
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

  getFormattedDate(date: Date | string): string {
    return moment(date).format(this.dateFormat);
  }
}
