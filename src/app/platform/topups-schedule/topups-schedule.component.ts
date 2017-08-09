import { Component, OnDestroy } from '@angular/core';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TopupsScheduleModel, TopupsSchedulePredicateObject } from '../../shared/models/topups-schedule.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { topupsScheduleActions } from '../../shared/reducers/topups-schedule.reducer';
import { StateModel } from '../../shared/models/state.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { RoleService } from '../../shared/services/role.service';
import { LanguageService } from '../../shared/services/language.service';
import { ProfileModel } from '../../shared/models/profile.model';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConfigService } from '../../shared/services/app-config.service';

const TOPUPS_SCHEDULE_ROUTE = 'platform/topups-schedule';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const FILTER_SECTIONS = ['BASIC', 'ISSUER'];

@Component({
  selector: 'mss-topups-schedule-list',
  templateUrl: './topups-schedule.component.html',
  styleUrls: ['./topups-schedule.component.scss']
})
export class TopupsScheduleComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  loading = false;

  tableData: Pagination<TopupsScheduleModel>;
  rows: TopupsScheduleModel[] = [];
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;

  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;
  issuerCodes: SelectItem[] = [];
  cardGroupCodes: SelectItem[] = [];
  stateOptions: SelectItem[] = [];
  filterForm: FormGroup;
  topUpsScheduleFilterSections = FILTER_SECTIONS;

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private roles: RoleService,
              private language: LanguageService,
              private config: AppConfigService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getTopupsScheduleList();
      }
    );

    this.config.get('topUpsScheduleStates').subscribe(
      (states: string[]) => {
        this.stateOptions = states.map(state => ({
          value: state,
          label: this.language.translate(`enums.topUpsScheduleStates.${state}`)
        }));
      }
    );

    this.filterForm = this.fb.group({
      cardGroupId: [{value: '', disabled: true}],
      issuerCode: [{value: '', disabled: true}],
      specificSymbol: [''],
      variableSymbol: [''],
      state: ['']
    });

    this.filterSections = this.topUpsScheduleFilterSections.map(item => ({
        label: this.language.translate(`topupsSchedule.list.filterSections.${item}`),
      value: item
      }));
    this.visibleSection = this.filterSections[0];

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<ProfileModel>) => {
        if (data.error) {
          if (data.error instanceof MissingTokenResponse) {
            return;
          }
          console.error('Profile API call has returned error', data.error);
          return;
        }
        if (data.data && !data.loading) {
          const user = data.data;

          // is it admin?
          this.roles.isVisible('topupsSchedule.issuerCodeSelect').subscribe(
            result => {
              if (result) {
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                // is it issuer?
                this.roles.isVisible('topupsSchedule.cardGroupCodeSelect').subscribe(
                  cardGroupResult => {
                    if (cardGroupResult) {
                      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: user.resourceId});
                    } else {
                      // remove this tab from view because there is nothing to display
                      this.filterSections = this.filterSections.filter(section => section.value !== 'ISSUER');
                    }
                  }
                );
              }
            }
          );
        }
      }
    );

    this.store.select('issuerCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting issuer codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.issuerCodes = data.data.map(item => ({value: item.id, label: item.code}));
          this.enableFormItem('issuerCode');
        }
      }
    );

    this.store.select('cardGroupCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting card group codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.cardGroupCodes = data.data.map(item => ({value: item.id, label: item.code}));
          this.enableFormItem('cardGroupId');
        }
      }
    );

    this.filterForm.get('issuerCode').valueChanges.subscribe(
      (id) => {
        this.cardGroupCodes = [];
        this.disableFormItem('cardGroupId');
        if (id != null && id.length > 0) {
          this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: id});
        }
      }
    );


    this.store.select('topupsSchedule').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<TopupsScheduleModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Topups schedule API call has returned an error', error);
          return;
        }

        if (data != null && !loading) {
          this.tableData = data;
          this.rows = data.content;
        }
      }
    );
  }

  get requestModel(): RequestOptions<TopupsSchedulePredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: this.predicateObject
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  get predicateObject(): TopupsSchedulePredicateObject {
    if (!this.filterForm) {
      return {};
    }
    const search = Object.keys(this.filterForm.value)
      .filter(key => this.filterForm.value[key] != null && this.filterForm.value[key].length > 0)
      .reduce(
        (acc, item) => {
          acc[item] = this.filterForm.value[item];
          return acc;
        },
        {}
      );
    return search;
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${TOPUPS_SCHEDULE_ROUTE}`, routeParams]);
  }

  changeLimit(limit: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([TOPUPS_SCHEDULE_ROUTE, routeParams]);
  }

  getTopupsScheduleList(): void {
    this.store.dispatch({type: topupsScheduleActions.TOPUPS_SCHEDULE_API_GET, payload: this.requestModel});
  }

  getSortedTopupsScheduleList(sortInfo: any): void {
    this.sortOption = {
      predicate: sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc'
    };
    this.getTopupsScheduleList();
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  enableFormItem(key: string): void {
    if (this.filterForm) {
      this.filterForm.get(key).enable();
    }
  }

  disableFormItem(key: string): void {
    this.filterForm.get(key).patchValue('');
    this.filterForm.get(key).disable();
  }

  goToDetail(row: TopupsScheduleModel): void {
    this.router.navigateByUrl(`platform/topups-schedule/${row.filename}`);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
