import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { StateModel } from '../../shared/models/state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TemplateModel, TemplatePredicateObject } from '../../shared/models/template.model';
import { templatesActions } from '../../shared/reducers/template.reducer';
import { userResourceActions } from '../../shared/reducers/user-resource.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const TEMPLATE_ROUTE = 'platform/templates';

@Component({
  selector: 'mss-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  loading = true;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  totalItems = 0;
  pageNumber = 0;
  sortOptions: {
    predicate: string;
    reverse: boolean
  };
  templates: TemplateModel[] = [];
  resourcesArray: SelectItem[] = [];

  filterForm: FormGroup;


  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute) {

    this.filterForm = this.fb.group({
      name: [null],
      system: [null],
      resource: [{value: null, disabled: true}]
    });

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getTemplates();
      }
    );

    this.store.select('templates').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<TemplateModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Template API call has returned error', error);
          return;
        }
        if (data != null) {
          this.templates = data.content;
          this.totalItems = data.totalElements;
        }
      }
    );

    this.store.select('userResource').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<string[]>) => {
        if (error) {
          console.error('User resource API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          this.resourcesArray = data.map(val => ({value: val}));
          this.filterForm.get('resource').enable();
        }
      }
    );
    this.store.dispatch({type: userResourceActions.USER_RESOURCE_GET_REQUEST});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeLimit(limit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(limit)
    };
    this.router.navigate([`${TEMPLATE_ROUTE}`, routeParams]);
  }

  onSelect({selected}: { selected: TemplateModel[] }): void {
    if (selected && selected.length > 0) {
      this.router.navigateByUrl(`/platform/templates/detail/${selected[0].id}`);
    }
  }

  setPage(pageInfo: any): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${TEMPLATE_ROUTE}`, routeParams]);
  }

  getTemplates(): void {
    this.store.dispatch({type: templatesActions.TEMPLATES_GET_REQUEST, payload: this.requestModel});
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  private get requestModel(): RequestOptions<TemplatePredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1 ) * this.rowLimit
      },
      search: {
        predicateObject: this.predicateObject,
      },
      sort: this.sortOptions ? this.sortOptions : {}
    };
  }

  private get predicateObject(): TemplatePredicateObject {
    return this.filterForm.value;
  }

}
