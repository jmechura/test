import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { CardRequestModel, CardRequestSearchModel } from '../../shared/models/card-request.model';
import { StateModel } from '../../shared/models/state.model';
import { cardRequestActions } from '../../shared/reducers/card-request.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { Moment } from 'moment';
import { ProfileModel } from '../../shared/models/profile.model';
import { cardRequestStateActions } from '../../shared/reducers/card-request-state.reducer';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { CodeModel } from '../../shared/models/code.model';
import { UnsubscribeSubject, MissingTokenResponse } from '../../shared/utils';
import { LanguageService } from '../../shared/language/language.service';

const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';
const API_ENDPOINT = '/cards/requests';

@Component({
  selector: 'mss-card-request',
  templateUrl: './card-request.component.html',
  styleUrls: ['./card-request.component.scss']
})
export class CardRequestComponent {

  private unsubscribe$ = new UnsubscribeSubject();
  searchModel: RequestOptions<CardRequestSearchModel> = {
    pagination: {
      number: 10,
      numberOfPages: 0,
      start: 0,
    },
    search: {
      predicateObject: {
        cardGroupCode: '',
        issuerCode: '',
        state: 'NEW'
      }
    },
    sort: {}
  };
  cardGroupCodes: SelectItem[] = [];
  requestStates: SelectItem[] = [{value: 'NEW'}, {value: 'ENABLED'}, {value: 'BLOCKED'}];
  fromDate: Moment = null;
  toDate: Moment = null;
  issuerCode: string;
  loading = false;
  tableData: Pagination<CardRequestModel>;
  rows: any[] = [];

  modalVisible = false;
  modalDisplaying: 'confirm' | 'decline';
  confirmDeclineUuid: string;

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private language: LanguageService,
              private api: ApiService) {

    this.store.dispatch({type: cardRequestStateActions.CARD_REQUEST_STATE_GET_REQUEST});
    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<ProfileModel>) => {
        if (error instanceof MissingTokenResponse) {
          return;
        }

        if (error !== null) {
          console.error('Error occurred while getting profile', error);
          return;
        }

        if (data != null) {
          this.issuerCode = data.issuerCode;
          // TODO: uncomment after issuerCode is got in profile model to get valid requests for issuer
          // this.searchModel.search.predicateObject.issuerCode = data.data.issuerCode;
          this.searchModel.search.predicateObject.issuerCode = 'bancibo';
          this.store.dispatch(
            {
              type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST,
              payload: this.searchModel.search.predicateObject.issuerCode
            }
          );
        }
      }
    );
    this.store.select('cardRequests').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Pagination<CardRequestModel>>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error('Error occurred while getting card requests', data.error);
          return;
        }
        if (data.data != undefined && !data.loading) {
          this.tableData = data.data;
          this.rows = this.tableData.content.map(item => (
            {
              name: item.cardGroupName,
              state: item.state,
              number: item.cardNumber,
              uuid: item.uuid
            }
          ));
        }
      }
    );

    this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error occurred while getting card group codes', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.cardGroupCodes = data.data.map(item => ({value: item.code}));
        }
      }
    );

    this.store.select('cardRequestStates').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while getting card request states.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.requestStates = data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.cardRequestStates.${item}`)
          }));
        }
      }
    );
  }

  /**
   * Sets transaction from date for filtering
   * @param date
   */
  changeFromDate(date: Moment): void {
    this.fromDate = date;
    this.searchModel.search.predicateObject.createdFrom = date.format(DATE_FORMAT);
  }

  /**
   * Sets transaction to date for filtering
   * @param date
   */
  changeToDate(date: Moment): void {
    this.toDate = date;
    this.searchModel.search.predicateObject.createdTo = date.format(DATE_FORMAT);
  }

  /**
   * Sets filtering model to the default values
   */
  clearFilter(): void {
    this.fromDate = null;
    this.toDate = null;
    this.searchModel.search.predicateObject.cardGroupCode = '';
    this.searchModel.search.predicateObject.state = 'NEW';
  }

  /**
   * Sends requests to the API in order to get card requests based on provided filtering model
   * Unused fields in search model are removed before request to prevent api errors
   */
  getRequests(): void {
    const search = Object.keys(this.searchModel.search.predicateObject)
      .filter(key => this.searchModel.search.predicateObject[key] != null && this.searchModel.search.predicateObject[key].length > 0)
      .reduce(
        (acc, item) => {
          acc[item] = this.searchModel.search.predicateObject[item];
          return acc;
        },
        {}
      );
    this.store.dispatch({
      type: cardRequestActions.CARD_REQUEST_GET_REQUEST,
      payload: Object.assign(this.searchModel, {search: {predicateObject: search}})
    });
  }

  getSortedCardRequests(sortInfo: any): void {
    this.searchModel.sort = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getRequests();
  }

  /**
   * Changes max rows displayed in table
   * Changes pagination object and gets new set of data
   * @param limit
   */
  changeLimit(limit: number): void {
    if (this.searchModel.pagination.number !== limit) {
      this.searchModel.pagination.number = limit;
      this.store.dispatch({type: cardRequestActions.CARD_REQUEST_GET_REQUEST, payload: this.searchModel});
    }
  }

  /**
   * Sets current page of displayed data as offset in pagination object
   * Gets new data afterwards
   * @param pageInfo
   */
  setPage(pageInfo: any): void {
    this.searchModel.pagination.start = pageInfo.offset * this.searchModel.pagination.number;
    this.store.dispatch({type: cardRequestActions.CARD_REQUEST_GET_REQUEST, payload: this.searchModel});
  }

  /**
   * Redirects to the card request detail
   * @param row
   */
  goToDetail(row: any): void {
    this.router.navigateByUrl(`platform/card-request/${row.row.uuid}`);
  }


  /**
   * Called after decline or confirm button click
   * Sets uuid of card request, action type and shows modal
   * @param row
   * @param type
   * @param event
   */
  handleActionClick(row: any, type: 'confirm' | 'decline', event: MouseEvent): void {
    event.stopPropagation();
    this.confirmDeclineUuid = row.uuid;
    this.modalVisible = true;
    this.modalDisplaying = type;
  }

  /**
   * Sends confirm request
   * Refreshes data if succeeds
   */
  sendConfirm(): void {
    this.modalVisible = false;
    this.api.get(`${API_ENDPOINT}/confirm/${this.confirmDeclineUuid}`).subscribe(
      () => {
        // actualize data because only message and 200 was sent
        this.getRequests();
      },
      (error) => {
        console.error('Error occurred while requesting for card request confirm.', error);
      }
    );
  }

  /**
   * Sends declining request
   * Rereshes data if suceeds
   */
  sendDecline(): void {
    this.modalVisible = false;
    this.api.get(`${API_ENDPOINT}/canceled/${this.confirmDeclineUuid}`).subscribe(
      () => {
        // actualize data because only message and 200 was sent
        this.getRequests();
      },
      (error) => {
        console.error('Error occurred while requesting for card request cancel.', error);
      }
    );
  }

}
