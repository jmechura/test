import { Component, OnDestroy } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { importActions, ImportState } from '../../shared/reducers/imports.reducer';
import { RequestOptions } from '../../shared/models/pagination.model';
import { ImportModel, ImportPredicateObject } from '../../shared/models/import.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import { importTypeActions } from '../../shared/reducers/import-type.reducer';
import { ApiService } from '../../shared/services/api.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { UnsubscribeSubject } from '../../shared/utils';
import { StateModel } from '../../shared/models/state.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { LanguageService } from '../../shared/services/language.service';
import { FormBuilder, FormGroup } from '@angular/forms';

const IMPORT_ROUTE = 'platform/imports';
const IMPORT_ENDPOINT = '/imports';
const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const IMPORT_DESTROY_ENDPOINT = '/imports/destroy';
const IMPORT_START_ENDPOINT = '/imports/start';

@Component({
  selector: 'mss-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.scss']
})
export class ImportsComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;
  sortOption: {
    predicate: string;
    reverse: boolean
  };
  tableRows: ImportModel[] = [];
  loading = false;
  deletingName: string;
  deleteModalVisible = false;
  importTypes: SelectItem[] = [];
  filterForm: FormGroup;

  constructor(private store: Store<AppStateModel>,
              private route: ActivatedRoute,
              private api: ApiService,
              private router: Router,
              private fb: FormBuilder,
              private language: LanguageService,
              private toastr: ExtendedToastrService) {
    this.store.dispatch({type: importTypeActions.IMPORT_TYPE_GET_REQUEST});

    this.filterForm = this.fb.group({
      name: [''],
      type: [null]
    });

    this.store.select('imports').takeUntil(this.unsubscribe$).subscribe(
      (data: ImportState) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(`Error occurred while getting imports.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.tableRows = data.data.content.map(item => item);
          this.totalItems = data.data.totalElements;
        }
      }
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getImports();
      }
    );

    this.store.select('importTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting imports.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.importTypes = data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.importTypes.${item}`)
          }));
        }
      }
    );
  }

  getSortedImports(sortInfo: any): void {
    this.sortOption = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getImports();
  }

  getImports(): void {
    this.store.dispatch({type: importActions.IMPORTS_GET_REQUEST, payload: this.requestModel});
  }

  goToDetail(name: string): void {
    this.router.navigateByUrl(`platform/imports/${name}`);
  }

  goToCreate(): void {
    this.router.navigateByUrl('platform/imports/create');
  }

  showDeleteModal(event: MouseEvent, name: string): void {
    event.stopPropagation();
    this.deletingName = name;
    this.deleteModalVisible = true;
  }

  clearFilter(): void {
    this.filterForm.reset();
  }

  deleteImport(): void {
    this.api.remove(`${IMPORT_ENDPOINT}/${this.deletingName}`).subscribe(
      () => {
        this.toastr.success('toastr.success.deleteImport');
        this.getImports();
        this.deleteModalVisible = false;
      },
      (error) => {
        this.toastr.error(error);
        console.error('Error occurred while deleting import.', error);
        this.deleteModalVisible = false;
      }
    );
  }

  toggle(event: MouseEvent, row: ImportModel): void {
    event.stopPropagation();
    this.api.get(`${row.running ? IMPORT_DESTROY_ENDPOINT : IMPORT_START_ENDPOINT}/${row.name}`).subscribe(
      () => {
        this.getImports();
      },
      (error) => {
        console.error('Error occurred while updating state of import.', error);
      }
    );
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${IMPORT_ROUTE}`, routeParams]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  private get requestModel(): RequestOptions<ImportPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit
      },
      search: {
        predicateObject: this.predicateObject
      },
      sort: this.sortOption ? this.sortOption : {}
    };
  }

  private get predicateObject(): ImportPredicateObject {
    const reportType = this.filterForm.get('type').value;
    return {
      name: this.filterForm.get('name').value,
      ...(reportType && reportType.length > 0 ? {type: reportType} : {})
    };
  }

  itemsPerPage(itemLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(itemLimit)
    };
    this.router.navigate([`${IMPORT_ROUTE}`, routeParams]);
  }

}
