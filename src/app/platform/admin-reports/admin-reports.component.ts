import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { adminReportActions, AdminReportState } from '../../shared/reducers/admin-reports.reducer';
import { RequestOptions } from '../../shared/models/pagination.model';
import { AdminReportModel, AdminReportPredicateObject } from '../../shared/models/admin-report.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { reportTypeActions } from '../../shared/reducers/report-types.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { StateModel } from '../../shared/models/state.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStateModel } from '../../shared/models/app-state.model';
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const REPORT_ROUTE = 'platform/admin-reports';
const REPORT_ENDPOINT = '/reports';
const REPORT_DESTROY_ENDPOINT = '/reports/destroy';
const REPORT_START_ENDPOINT = '/reports/start';

@Component({
  selector: 'mss-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  newReportModalVisible = false;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  totalItems = 0;
  pageNumber = 0;
  sortOptions: {
    predicate: string;
    reverse: boolean
  };
  reportTypes: SelectItem[] = [];
  loading = false;
  tableRows: AdminReportModel[] = [];
  newReportForm: FormGroup;
  deleteModalVisible = false;
  deletingName: string;

  constructor(private store: Store<AppStateModel>,
              private language: LanguageService,
              private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private api: ApiService,
              private toastr: ExtendedToastrService) {
    this.store.dispatch({type: reportTypeActions.REPORT_TYPE_GET_REQUEST});
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getReports();
      }
    );

    this.store.select('reportTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting report types.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.reportTypes = data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.reportTypes.${item}`)
          }));
        }
      }
    );

    this.store.select('adminReports').takeUntil(this.unsubscribe$).subscribe(
      (data: AdminReportState) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(`Error occurred while getting reports.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.tableRows = data.data.content;
          this.totalItems = data.data.totalElements;
        }
      }
    );

    this.newReportForm = this.fb.group({
      name: ['', Validators.required],
      runAfterStart: [false],
      type: ['']
    });

  }

  getReports(): void {
    this.store.dispatch({type: adminReportActions.ADMIN_REPORTS_GET_REQUEST, payload: this.requestModel});
  }

  getSortedReports(sortInfo: any): void {
    this.sortOptions = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getReports();
  }

  addNewReport(): void {
    this.api.post(REPORT_ENDPOINT, this.newReportForm.value).subscribe(
      () => {
        this.toastr.success('toastr.success.addReport');
        this.newReportModalVisible = false;
        this.getReports();
      },
      (error) => {
        console.error('Error occurred while creating new report.', error);
        this.toastr.error(error);
        this.newReportModalVisible = false;
      }
    );
  }

  showDeleteModal(event: MouseEvent, name: string): void {
    event.stopPropagation();
    this.deletingName = name;
    this.deleteModalVisible = true;
  }

  deleteReport(): void {
    this.api.remove(`${REPORT_ENDPOINT}/${this.deletingName}`).subscribe(
      () => {
        this.toastr.success('toastr.success.deleteReport');
        this.deleteModalVisible = false;
        this.getReports();
      },
      (error) => {
        console.error('Error occurred while creating new report.', error);
        this.toastr.error(error);
        this.deleteModalVisible = false;
      }
    );
  }

  toggle(event: MouseEvent, row: AdminReportModel): void {
    event.stopPropagation();
    this.api.get(`${row.running ? REPORT_DESTROY_ENDPOINT : REPORT_START_ENDPOINT}/${row.name}`).subscribe(
      () => {
        this.getReports();
      },
      (error) => {
        console.error('Error occurred while updating state of import.', error);
      }
    );
  }

  goToDetail(name: string): void {
    this.router.navigateByUrl(`platform/admin-reports/${name}`);
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${REPORT_ROUTE}`, routeParams]);
  }

  isPresent(value: string): boolean {
    const item = this.newReportForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  itemsPerPage(itemLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(itemLimit)
    };
    this.router.navigate([`${REPORT_ROUTE}`, routeParams]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  private get requestModel(): RequestOptions<AdminReportPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1 ) * this.rowLimit
      },
      search: {},
      sort: this.sortOptions ? this.sortOptions : {}
    };
  }

}
