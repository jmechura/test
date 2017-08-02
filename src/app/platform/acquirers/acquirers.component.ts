import { Component, OnDestroy } from '@angular/core';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { UnsubscribeSubject } from '../../shared/utils';
import { AcquirerState, acquirerActions } from '../../shared/reducers/acquirers.reducer';
import { RequestOptions } from '../../shared/models/pagination.model';
import { AcquirerPredicateObject } from '../../shared/models/acquirer.model';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcquirerSections } from '../../shared/enums/acquirer-sections.enum';
import { LanguageService } from '../../shared/services/language.service';
import { StateModel } from '../../shared/models/state.model';
import { countryCodeActions } from '../../shared/reducers/country-code.reducer';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const ACQUIRERS_ROUTE = 'platform/acquirers';
const ACQUIRERS_ENDPOINT = '/networks';

@Component({
  selector: 'mss-acquirers',
  templateUrl: './acquirers.component.html',
  styleUrls: ['./acquirers.component.scss']
})
export class AcquirersComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  loading = false;
  pageNumber = 1;
  rowLimit = ITEM_LIMIT_OPTIONS[0];
  totalItems = 0;
  sortOptions: {
    predicate: string;
    reverse: boolean;
  };
  tableRows = [];
  deleteModalVisible = false;
  deletingCode: string;
  tabsOptions: SelectItem[] = [];
  visibleTab: SelectItem;
  newAcquirerForm: FormGroup;
  AcquirerSections = AcquirerSections;
  countries: SelectItem[] = [];

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private api: ApiService,
              private fb: FormBuilder,
              private language: LanguageService,
              private route: ActivatedRoute) {
    this.store.dispatch({type: countryCodeActions.COUNTRY_CODE_GET_REQUEST});
    this.store.select('acquirers').takeUntil(this.unsubscribe$).subscribe(
      (data: AcquirerState) => {
        this.loading = data.loading;
        if (data.error) {
          console.error(`Error occurred while retrieving acquirer data from api.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.totalItems = data.data.totalElements;
          this.tableRows = data.data.content;
        }
      }
    );

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

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getAcquirers();
      }
    );

    this.newAcquirerForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      acquiringInstitutionCode: ['', Validators.required],
      hsmKeyName: ['', Validators.required],
      hsmTransitKeyName: ['', Validators.required],
      country: [null],
      region: [''],
      city: [''],
      street: [''],
      zip: [''],
    });

    this.tabsOptions = [{
      value: AcquirerSections.BASIC,
      label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.BASIC]}`)
    },
      {
        value: AcquirerSections.ADDRESS,
        label: this.language.translate(`enums.acquirerSections.${AcquirerSections[AcquirerSections.ADDRESS]}`)
      }
    ];

    this.visibleTab = this.tabsOptions[0];
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${ACQUIRERS_ROUTE}`, routeParams]);
  }

  itemsPerPage(itemLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(itemLimit)
    };
    this.router.navigate([`${ACQUIRERS_ROUTE}`, routeParams]);
  }

  showDeleteModal(event: MouseEvent, code: string): void {
    event.stopPropagation();
    this.deletingCode = code;
    this.deleteModalVisible = true;
  }

  goToCreateAcquirer(): void {
    this.router.navigateByUrl(`${ACQUIRERS_ROUTE}/create`);
  }

  deleteAcquirer(): void {
    this.api.remove(`${ACQUIRERS_ENDPOINT}/${this.deletingCode}`).subscribe(
      () => {
        this.getAcquirers();
      },
      (error) => {
        console.error(`Error occurred while deleting acquirer.`, error);
      }
    );
  }

  goToDetail(code: string): void {
    this.router.navigateByUrl(`${ACQUIRERS_ROUTE}/${code}`);
  }

  getAcquirers(): void {
    this.store.dispatch({type: acquirerActions.ACQUIRERS_GET_REQUEST, payload: this.requestModel});
  }

  getSortedAcquirers(sortInfo: any): void {
    this.sortOptions = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getAcquirers();
  }

  isInvalid(value: string): boolean {
    const item = this.newAcquirerForm.get(value);
    return item.touched && item.invalid;
  }

  private get requestModel(): RequestOptions<AcquirerPredicateObject> {
    return {
      pagination: {
        number: this.rowLimit,
        numberOfPages: 0,
        start: (this.pageNumber - 1) * this.rowLimit
      },
      search: {},
      sort: this.sortOptions ? this.sortOptions : {}
    };
  }

}
