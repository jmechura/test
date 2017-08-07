import { Component, OnDestroy } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { cardGroupActions, CardGroupState } from '../../shared/reducers/card-group.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { CardGroupModel, CardGroupSearchModel } from '../../shared/models/card-group.model';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { StateModel } from '../../shared/models/state.model';
import { CodeModel } from '../../shared/models/code.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { taxTypeActions } from '../../shared/reducers/tax-types.reducer';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { RoleService } from '../../shared/services/role.service';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';
import { AppConfigService } from '../../shared/services/app-config.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

@Component({
  selector: 'mss-card-groups',
  templateUrl: './card-groups.component.html',
  styleUrls: ['./card-groups.component.scss']
})
export class CardGroupsComponent implements OnDestroy {
  requestModel: RequestOptions<CardGroupSearchModel> = {
    pagination: {
      number: 10,
      numberOfPages: 0,
      start: 0
    },
    search: {
      predicateObject: {}
    },
    sort: {}
  };
  cardFilterSection = ['BASIC', 'ISSUER'];
  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;
  issuerTab = false;
  issuerCodes: SelectItem[] = [];
  cardGroupCodes: SelectItem[] = [];
  tableData: Pagination<CardGroupModel>;
  loading = false;
  rows: any[] = [];
  filterForm: FormGroup;
  states: SelectItem[] = [{value: 'ENABLED'}];
  taxTypes: SelectItem[] = [];
  limitsAllowed = false;
  countries: SelectItem[] = [];
  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private store: Store<AppStateModel>,
              private fb: FormBuilder,
              private language: LanguageService,
              private router: Router,
              private roles: RoleService,
              private configService: AppConfigService,
              private toastr: ExtendedToastrService) {


    this.filterSections = this.cardFilterSection.filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`cardGroups.sections.${item}`),
        value: item
      }));
    this.visibleSection = this.filterSections[0];
    this.filterForm = fb.group(
      {
        issuerCode: {value: '', disabled: true},
        cardGroupCode: {value: '', disabled: true},
        name: '',
        id: '',
        ico: '',
        dic: '',
        city: ''
      }
    );

    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});
    this.store.select('countryCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(`Error occurred while getting country codes from api.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.countries = data.data.map(country => ({value: country}));
        }
      }
    );

    this.store.dispatch({type: taxTypeActions.TAX_TYPES_GET_REQUEST});
    this.store.select('cardGroups').takeUntil(this.unsubscribe$).subscribe(
      (data: CardGroupState) => {
        if (data.error) {
          console.error('Error occured while retrieving card groups data from api.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.tableData = data.data;
          this.rows = data.data.content.map(item => item);
        }
      }
    );

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<ProfileModel>) => {
        if (error instanceof MissingTokenResponse) {
          return;
        }

        if (error !== null) {
          console.error('Error occurred while retrieving profile', error);
          return;
        }

        if (data != null) {
          this.roles.isVisible('cardGroups.issuerCodeSelect').subscribe(
            issuerResult => {
              if (issuerResult) {
                this.issuerTab = true;
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('cardGroups.cardGroupCodeSelect').subscribe(
                  cardGroupResult => {
                    if (cardGroupResult) {
                      this.issuerTab = true;
                      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: data.resourceId});
                    }
                  }
                );
              }
            }
          );
          this.roles.isVisible('cardGroups.limits').subscribe(
            limitsResult => {
              if (limitsResult) {
                this.limitsAllowed = true;
              }
            }
          );
        }
      }
    );

    this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving issuer codes.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.issuerCodes = data.data.map(code => ({value: code.id, label: code.code}));
          this.filterForm.get('issuerCode').enable();
        }
      }
    );

    this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card group codes.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.cardGroupCodes = data.data.map(code => ({value: code.name}));
          this.filterForm.get('cardGroupCode').enable();
        }
      }
    );

    this.store.select('taxTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving tax types.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.taxTypes = data.data.map(item => ({value: item}));
        }
      }
    );
    this.getCardGroups();
  }

  getCardGroups(): void {
    this.store.dispatch(
      {
        type: cardGroupActions.CARD_GROUPS_GET_REQUEST,
        payload: Object.assign({}, this.requestModel, {search: {predicateObject: this.filterForm.value}})
      }
    );
  }

  getSortedCardGroups(sortInfo: any): void {
    this.requestModel.sort = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getCardGroups();
  }

  changeLimit(limit: number): void {
    if (limit !== this.requestModel.pagination.number) {
      this.requestModel.pagination.number = limit;
      this.getCardGroups();
    }
  }

  setPage(pageInfo: any): void {
    this.requestModel.pagination.start = pageInfo.offset * this.requestModel.pagination.number;
    this.getCardGroups();
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  goToDetail(item: any): void {
    this.router.navigateByUrl(`platform/card-groups/${item.row.id}`);
  }

  issuerSelect(issuerCode: string): void {
    this.filterForm.get('cardGroupCode').disable();
    this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: issuerCode});
  }

  goToCreate(): void {
    this.router.navigateByUrl('platform/card-groups/create');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

}
