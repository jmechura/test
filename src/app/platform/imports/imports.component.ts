import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { importActions, ImportState } from '../../shared/reducers/imports.reducer';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { ImportModel, ImportPredicateObject } from '../../shared/models/import.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { StateModel } from '../../shared/models/state.model';
import { LanguageService } from '../../shared/language/language.service';
import { importTypeActions } from '../../shared/reducers/import-type.reducer';
import { ApiService } from '../../shared/services/api.service';

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

  private unsubscribe$ = new Subject<void>();
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;
  sortOption: {
    predicate: string;
    reverse: boolean
  };
  tableData: Pagination<ImportModel>;
  tableRows: ImportModel[] = [];
  loading = false;
  newImportModalVisible = false;
  newImportForm: FormGroup;
  importTypes: SelectItem[] = [];
  deletingName: string;
  deleteModalVisible = false;

  constructor(private store: Store<AppState>,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private api: ApiService,
              private language: LanguageService,
              private router: Router) {
    this.store.dispatch({type: importTypeActions.IMPORT_TYPE_GET_REQUEST});
    this.store.select('imports').takeUntil(this.unsubscribe$).subscribe(
      (data: ImportState) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(`Error occurred while getting imports.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.tableData = data.data;
          this.tableRows = data.data.content.map(item => item);
          this.totalItems = data.data.totalElements;
        }
      }
    );

    this.store.select('importTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        this.loading = data.loading;
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

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getImports();
      }
    );

    this.newImportForm = this.fb.group({
      name: ['', Validators.required],
      nameRead: [''],
      runAfterStart: [false],
      type: ['']
    });

  }

  getSortedImports(sortInfo: any): void {
    this.sortOption = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getImports();
  }

  getImports(): void {
    this.store.dispatch({type: importActions.IMPORTS_GET_REQUEST, payload: this.requestModel});
  }

  isPresent(value: string): boolean {
    const item = this.newImportForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  goToDetail(name: string): void {
    this.router.navigateByUrl(`platform/imports/${name}`);
  }

  addNewImport(): void {
    this.api.post(IMPORT_ENDPOINT, this.newImportForm.value).subscribe(
      () => {
        this.getImports();
        this.newImportModalVisible = false;
      },
      (error) => {
        console.error('Error occurred while creating new import.', error);
      }
    );
  }

  showDeleteModal(event: MouseEvent, name: string): void {
    event.stopPropagation();
    this.deletingName = name;
    this.deleteModalVisible = true;
  }

  deleteImport(): void {
    this.api.remove(`${IMPORT_ENDPOINT}/${this.deletingName}`).subscribe(
      () => {
        this.getImports();
        this.deleteModalVisible = false;
      },
      (error) => {
        console.error('Error occurred while deleting import.', error);
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private get requestModel(): RequestOptions<ImportPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit
      },
      search: {},
      sort: this.sortOption ? this.sortOption : {}
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
