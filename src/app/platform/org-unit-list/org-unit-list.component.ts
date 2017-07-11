import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { orgUnitListActions, OrgUnitListState } from '../../shared/reducers/org-unit-list.reducer';
import { OrgUnitModel, OrgUnitPredicateObject } from '../../shared/models/org-unit.model';
import { ApiService } from '../../shared/services/api.service';
import { RequestOptions } from '../../shared/models/pagination.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';

const ORG_UNIT_ENDPOINT = '/orgUnits';
const ORG_UNIT_ROUTE = '/platform/org-units';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-org-unit-list',
  templateUrl: './org-unit-list.component.html',
  styleUrls: ['./org-unit-list.component.scss']
})
export class OrgUnitListComponent implements OnDestroy {
  pageNumber = 0;
  totalItems = 0;
  private itemLimit = ITEM_LIMIT_OPTIONS[0];
  // other
  tableRows: OrgUnitModel[] = [];
  createModalShown = false;
  deleteModalShown = false;
  private selectedOrgUnitId: string;
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<AppState>, private api: ApiService, private router: Router, private route: ActivatedRoute) {
    this.store.select('orgUnitList').takeUntil(this.unsubscribe$).subscribe(
      (state: OrgUnitListState) => {
        if (state.error !== null) {
          console.error('Error getting org units', state.error);
          return;
        }

        if (state.data) {
          this.tableRows = state.data.content;
          this.totalItems = state.data.totalElements;
        }
      }
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Number(params.page) || 0;
        this.itemLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.store.dispatch({type: orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST, payload: this.requestModel});
      }
    );

    this.store.dispatch({type: orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST, payload: this.requestModel});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  set itemsPerPage(itemLimit: number) {
    const routeParams: ListRouteParamsModel = {
      page: '0',
      limit: String(itemLimit)
    };
    this.router.navigate([`${ORG_UNIT_ROUTE}`, routeParams]);
  }

  get itemsPerPage(): number {
    return this.itemLimit;
  }

  showCreateModal(): void {
    this.createModalShown = true;
  }

  hideCreateModal(): void {
    this.createModalShown = false;
  }

  createOrgUnit(model: OrgUnitModel): void {
    this.api.post(ORG_UNIT_ENDPOINT, model).subscribe(
      () => {
        this.store.dispatch({type: orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST, payload: this.requestModel});
        this.createModalShown = false;
      },
      error => {
        console.error('Error creating org unit', error);
      }
    );
  }

  showDeleteModal(orgUnitId: string): void {
    this.selectedOrgUnitId = orgUnitId;
    this.deleteModalShown = true;
  }

  hideDeleteModal(): void {
    this.deleteModalShown = false;
  }

  deleteOrgUnit(): void {
    this.api.remove(`${ORG_UNIT_ENDPOINT}/${this.selectedOrgUnitId}`).subscribe(
      () => {
        this.store.dispatch({type: orgUnitListActions.ORG_UNIT_LIST_GET_REQUEST, payload: this.requestModel});
        this.deleteModalShown = false;
      },
      error => {
        console.error('Error deleting org unit', error);
      }
    );
  }

  getDetailLink(orgUnitId: string): string {
    return `${ORG_UNIT_ROUTE}/${orgUnitId}`;
  }

  setPage(pageInfo: {offset: number}): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset),
      limit: String(this.itemLimit)
    };
    this.router.navigate([`${ORG_UNIT_ROUTE}`, routeParams]);
  }

  private get requestModel(): RequestOptions<OrgUnitPredicateObject> {
    return {
      pagination: {
        number: this.itemLimit,
        numberOfPages: 0,
        start: this.pageNumber * this.itemLimit
      },
      search: {},
      sort: {}
    };
  }
}
