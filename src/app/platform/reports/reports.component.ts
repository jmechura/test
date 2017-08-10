import { Component, OnDestroy } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../shared/services/language.service';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { reportsActions, ReportState } from '../../shared/reducers/reports.reducer';
import { ReportModel, ReportPredicateObject } from '../../shared/models/report.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { RequestOptions } from '../../shared/models/pagination.model';
import { ReportFilterSections } from '../../shared/enums/reports-filter-sections.enum';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { RoleService } from '../../shared/services/role.service';
import { StateModel } from '../../shared/models/state.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { issuerCodeActions } from '../../shared/reducers/issuer-code.reducer';
import { cardGroupCodeActions } from '../../shared/reducers/card-group-code.reducer';
import { networkCodeActions } from '../../shared/reducers/network-code.reducer';
import { merchantCodeActions } from '../../shared/reducers/merchant-code.reducer';
import { orgUnitCodeActions } from '../../shared/reducers/org-unit-code.reducer';
import { CodeModel } from '../../shared/models/code.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Moment } from 'moment';
import { ApiService } from '../../shared/services/api.service';
import * as FileSaver from 'file-saver';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const REPORT_ROUTE = 'platform/reports';
const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss';

declare function saveAs(data: Blob | File, filename?: string, disableAutoBom?: boolean): void;

@Component({
  selector: 'mss-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  rows: ReportModel[] = [];
  loading = false;
  pageNumber = 0;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  totalItems = 0;
  sortOptions: {
    predicate: string;
    reverse: boolean;
  };
  filterSections: SelectItem[] = [];
  visibleSection: SelectItem;
  reportFilterSection = ReportFilterSections;
  networkCodes: SelectItem[] = [];
  merchantCodes: SelectItem[] = [];
  orgUnitCodes: SelectItem[] = [];
  issuerCodes: SelectItem[] = [];
  cardGroupCodes: SelectItem[] = [];
  filterForm: FormGroup;

  constructor(private store: Store<AppStateModel>,
              private route: ActivatedRoute,
              private router: Router,
              private roles: RoleService,
              private fb: FormBuilder,
              private api: ApiService,
              private language: LanguageService) {

    this.filterForm = this.fb.group({
      createdFrom: [null],
      createdTo: [null],
      reportName: [''],
      networkCode: [{value: '', disabled: true}],
      merchantCode: [{value: '', disabled: true}],
      orgUnitCode: [{value: '', disabled: true}],
      issuerCode: [{value: '', disabled: true}],
      cardGroupCode: [{value: '', disabled: true}],
    });

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getReports();
      }
    );

    this.filterSections = Object.keys(ReportFilterSections).filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`reports.list.sections.${item}`),
        value: ReportFilterSections[item]
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
        if (data.data && !data.loading /*because pn would be sad*/) {
          const user = data.data;

          this.roles.isVisible('reports.issuerCodeSelect').subscribe(
            result => {
              if (result) {
                this.store.dispatch({type: issuerCodeActions.ISSUER_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('reports.cardGroupCodeSelect').subscribe(
                  cardGroupResult => {
                    if (cardGroupResult) {
                      this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: user.resourceId});
                    } else {
                      // remove this tab from view because there is nothing to display
                      this.filterSections = this.filterSections.filter(section => section.value !== ReportFilterSections.ISSUER);
                    }
                  }
                );
              }
            }
          );

          this.roles.isVisible('reports.networkCodeSelect').subscribe(
            networkResult => {
              if (networkResult) {
                this.store.dispatch({type: networkCodeActions.NETWORK_CODE_GET_REQUEST});
              } else {
                this.roles.isVisible('reports.merchantCodeSelect').subscribe(
                  merchResult => {
                    if (merchResult) {
                      this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: user.resourceAcquirerId});
                    } else {

                      this.roles.isVisible('reports.orgUnitCodeSelect').subscribe(
                        orgUnitResult => {
                          if (orgUnitResult) {
                            this.store.dispatch({
                              type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST,
                              payload: user.resourceAcquirerId
                            });
                          } else {
                            // remove this tab from view because there is nothing to display
                            this.filterSections = this.filterSections.filter(section => section.value !== ReportFilterSections.ACQUIRER);
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );

    this.store.select('reports').takeUntil(this.unsubscribe$).subscribe(
      (data: ReportState) => {
        this.loading = data.loading;
        if (data.error) {
          console.error('Error occurred while retrieving reports data from api.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.rows = data.data.content;
          this.totalItems = data.data.totalElements;
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

    this.store.select('networkCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting network codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.networkCodes = data.data.map(item => ({value: item.id, label: item.code}));
          this.enableFormItem('networkCode');
        }
      }
    );

    this.store.select('merchantCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting merchant codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.merchantCodes = data.data.map(item => ({value: item.id, label: item.code}));
          this.enableFormItem('merchantCode');
        }
      }
    );

    this.store.select('orgUnitCodes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CodeModel[]>) => {
        if (data.error) {
          console.error('Error while getting org unit codes', data.error);
          return;
        }
        if (data.data != null && !data.loading) {
          this.orgUnitCodes = data.data.map(item => ({value: item.id, label: item.code}));
          this.enableFormItem('orgUnitCode');
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
          this.enableFormItem('cardGroupCode');
        }
      }
    );

    this.filterForm.get('networkCode').valueChanges.subscribe(
      (id) => {
        this.merchantCodes = [];
        this.orgUnitCodes = [];
        this.disableFormItem('merchantCode');
        this.disableFormItem('orgUnitCode');
        if (id != null && id.length > 0) {
          this.store.dispatch({type: merchantCodeActions.MERCHANT_CODE_GET_REQUEST, payload: id});
        }
      }
    );

    this.filterForm.get('merchantCode').valueChanges.subscribe(
      (id) => {
        this.orgUnitCodes = [];
        this.disableFormItem('orgUnitCode');
        if (id && id.length > 0) {
          this.store.dispatch({type: orgUnitCodeActions.ORG_UNIT_CODE_GET_REQUEST, payload: id});
        }
      }
    );

    this.filterForm.get('issuerCode').valueChanges.subscribe(
      (id) => {
        this.cardGroupCodes = [];
        this.disableFormItem('cardGroupCode');
        if (id && id.length > 0) {
          this.store.dispatch({type: cardGroupCodeActions.CARD_GROUP_CODE_GET_REQUEST, payload: id});
        }
      }
    );
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

  getReports(): void {
    this.store.dispatch({type: reportsActions.REPORTS_GET_REQUEST, payload: this.requestModel});
  }

  getSortedReports(sortInfo: any): void {
    this.sortOptions = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getReports();
  }

  download(id: number): void {
    this.api.getFile(`/reports/download/${id}`).subscribe(
      (resp: Response) => {
        const file = new Blob([resp.blob()]);
        FileSaver.saveAs(file, resp.headers.get('filename'));
      }
    );
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${REPORT_ROUTE}`, routeParams]);
  }

  itemsPerPage(itemLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(itemLimit)
    };
    this.router.navigate([`${REPORT_ROUTE}`, routeParams]);
  }

  private get requestModel(): RequestOptions<ReportPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1 ) * this.rowLimit
      },
      search: this.predicateObject,
      sort: this.sortOptions ? this.sortOptions : {}
    };
  }

  private getDate(date: Moment): string {
    return date.format(DATE_FORMAT);
  }

  private get predicateObject(): ReportPredicateObject {
    return {
      ...this.filterForm.value,
      ...{createdTo: this.filterForm.value.createdTo ? this.getDate(this.filterForm.value.createdTo) : ''},
      ...{createdFrom: this.filterForm.value.createdFrom ? this.getDate(this.filterForm.value.createdFrom) : ''}
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
