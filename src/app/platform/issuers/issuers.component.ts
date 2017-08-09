import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { issuersActions } from '../../shared/reducers/issuer.reducer';
import { IssuerModel, IssuerPredicateObject } from '../../shared/models/issuer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeSubject } from '../../shared/utils';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup } from '@angular/forms';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const ISSUER_ROUTE = 'platform/reports';

@Component({
  selector: 'mss-issuers',
  templateUrl: './issuers.component.html',
  styleUrls: ['./issuers.component.scss'],
})
export class IssuersComponent implements OnDestroy {

  issuers: IssuerModel[] = [];
  private unsubscribe$ = new UnsubscribeSubject();
  loading = false;
  rows = [];
  pageNumber = 0;
  totalItems = 0;
  sortOptions: {
    predicate: string;
    reverse: boolean;
  };
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  filterForm: FormGroup;

  stateOptions: SelectItem[] = [{value: 'ENABLED'}, {value: 'DISABLED'}];

  constructor(private store: Store<AppStateModel>,
              private route: ActivatedRoute,
              private router: Router,
              private language: LanguageService,
              private fb: FormBuilder,
              private toastr: ExtendedToastrService) {

    this.filterForm = this.fb.group({
      code: '',
      name: ''
    });

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getIssuers();
      }
    );

    this.store.select('issuers').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<IssuerModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Issuer API call has returned error', error);
          return;
        }
        if (data != null) {
          this.issuers = data.content;
          this.totalItems = data.totalElements;
          this.rows = this.issuers.map(item => Object.assign({}, item));
        }
      }
    );
  }

  getIssuers(): void {
    this.store.dispatch({type: issuersActions.ISSUERS_API_GET, payload: this.requestModel});
  }

  goToCreate(): void {
    this.router.navigateByUrl('/platform/issuers/create');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  onSelect({selected}: { selected: IssuerModel[] }): void {
    if (selected && selected.length > 0) {
      this.router.navigateByUrl(`/platform/issuers/${selected[0].code}`);
    }
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${ISSUER_ROUTE}`, routeParams]);
  }

  getSortedIssuers(sortInfo: any): void {
    this.sortOptions = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getIssuers();
  }

  changeLimit(itemLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(itemLimit)
    };
    this.router.navigate([`${ISSUER_ROUTE}`, routeParams]);
  }

  private get requestModel(): RequestOptions<IssuerPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1 ) * this.rowLimit
      },
      search: {predicateObject: this.predicateObject},
      sort: this.sortOptions ? this.sortOptions : {}
    };
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  private get predicateObject(): IssuerPredicateObject {
    return this.filterForm.value;
  }
}
