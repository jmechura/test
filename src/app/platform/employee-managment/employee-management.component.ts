import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { Store } from '@ngrx/store';
import { userListActions } from '../../shared/reducers/user-list.reducer';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { AppStateModel } from '../../shared/models/app-state.model';
import { AccountPredicateObject, ProfileModel } from '../../shared/models/profile.model';

const EMPLOYEES_ROUTE = 'platform/employees';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

const DEFAULT_FILTER = {
  cardGroupCode: '',
  cln: '',
  email: '',
  firstName: '',
  issuerCode: '',
  langKey: '',
  lastName: '',
  login: '',
  merchantCode: '',
  networkCode: '',
  orgUnitCode: '',
  terminalCode: ''
};

@Component({
  selector: 'mss-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnDestroy {

  loading = false;

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;
  tableRows: ProfileModel[];
  sortOption: {
    predicate: string;
    reverse: boolean;
  };

  private unsubscribe$ = new Subject<void>();
  usersData: Pagination<ProfileModel>;

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private route: ActivatedRoute) {

    this.store.select('userList').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<ProfileModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('User list API call returned error', error);
          return;
        }

        if (data != undefined) {
          this.usersData = data;
          this.tableRows = data.content.map(item => item) || [];
          this.totalItems = data.totalElements || 0;
        }
      }
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getUsers();
      }
    );
  }

  get requestModel(): RequestOptions<AccountPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit,
      },
      search: {
        predicateObject: Object.assign({}, DEFAULT_FILTER)
      },
      sort: this.sortOption != null ? this.sortOption : {},
    };
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${EMPLOYEES_ROUTE}`, routeParams]);
  }

  getUsers(): void {
    this.store.dispatch({type: userListActions.USER_LIST_GET_REQUEST, payload: this.requestModel});
  }

  onSelect(select: { selected: ProfileModel[] }): void {
    this.router.navigate([`${EMPLOYEES_ROUTE}/${select.selected[0].id}`]);
  }

  changeLimit(limit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit),
    };
    this.router.navigate([`${EMPLOYEES_ROUTE}`, routeParams]);
  }

  getSorted(sortInfo: any): void {
    this.sortOption = {
      predicate: sortInfo.sorts[0].prop,
      reverse: sortInfo.sorts[0].dir === 'asc',
    };
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
