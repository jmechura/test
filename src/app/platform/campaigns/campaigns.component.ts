import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { CampaignModel, CampaignPredicateObject, fillCampaign } from '../../shared/models/campaign.model';
import { campaignsActions } from '../../shared/reducers/campaign.reducer';
import { StateModel } from '../../shared/models/state.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { campaignFactoriesActions } from '../../shared/reducers/campaign-factories.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { UnsubscribeSubject } from '../../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../shared/services/language.service';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];
const CAMPAIGN_ROUTE = 'platform/campaigns';
const CAMPAIGN_DESTROY_ENDPOINT = '/campaigns/destroy';
const CAMPAIGN_START_ENDPOINT = '/campaigns/start';

@Component({
  selector: 'mss-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();

  rowLimit = ITEM_LIMIT_OPTIONS[0];
  pageNumber = 0;
  totalItems = 0;
  sortOptions: {
    predicate: string;
    reverse: boolean
  };

  newCampaignModalShowing = false;
  newCampaign: CampaignModel = fillCampaign();
  newCampaignForm: FormGroup;

  tableData: Pagination<CampaignModel>;
  rows = [];

  campaignFactories: SelectItem[] = [{value: 'UNKNOWN'}];

  editedRow = -1;
  editedCampaign: CampaignModel = fillCampaign();

  loading = false;

  warnModalVisible = false;
  deletingCampaignName: string;

  constructor(private store: Store<AppStateModel>,
              private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private language: LanguageService,
              private fb: FormBuilder) {

    this.newCampaignForm = fb.group({
      name: ['', Validators.required],
      orderCampaign: [0],
      runAfterStart: [false],
    });

    this.store.dispatch({type: campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_REQUEST});

    this.store.select('campaignFactories').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('Campaign Factories API call has returned error', error);
          return;
        }

        if (data != undefined) {
          this.campaignFactories = data.map(item => ({
            value: item,
            label: this.language.translate(`enums.campaignFactories.${item}`)
          }));
        }
      }
    );

    this.store.select('campaigns').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<CampaignModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Campaigns API call has returned error', error);
          return;
        }

        if (data != undefined) {
          this.tableData = data;
          this.totalItems = data.totalElements;
          this.rows = this.tableData.content.map(item => Object.assign({}, item));
        }
      }
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: ListRouteParamsModel) => {
        this.pageNumber = Math.max(Number(params.page) || 0, 1);
        this.rowLimit = ITEM_LIMIT_OPTIONS.find(limit => limit === Number(params.limit)) || ITEM_LIMIT_OPTIONS[0];
        this.getCampaignsList();
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  getCampaignsList(): void {
    this.store.dispatch({type: campaignsActions.CAMPAIGNS_GET_REQUEST, payload: this.requestModel});
  }

  getSortedCampaigns(sortInfo: any): void {
    this.sortOptions = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.getCampaignsList();
  }

  toggleNewCampaignForm(): void {
    this.newCampaignModalShowing = !this.newCampaignModalShowing;
  }

  addCampaign(): void {
    this.api.post('/campaigns', this.newCampaign).subscribe(
      () => {
        this.getCampaignsList();
      },
      error => {
        console.error('Create campaign fail', error);
      }
    );

    this.newCampaign = fillCampaign();
    this.toggleNewCampaignForm();
  };

  isPresent(value: string): boolean {
    const item = this.newCampaignForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  showDeleteModal(event: MouseEvent, name: string): void {
    event.stopPropagation();
    this.deletingCampaignName = name;
    this.warnModalVisible = true;
  }

  deleteCampaign(): void {
    this.api.remove(`/campaigns/${this.deletingCampaignName}`).subscribe(
      () => {
        this.getCampaignsList();
      },
      error => {
        console.error('Delete campaign fail', error);
      }
    );
  }

  changeLimit(newLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(newLimit)
    };
    this.router.navigate([`${CAMPAIGN_ROUTE}`, routeParams]);
  }

  startEditing(event: MouseEvent, row: any): void {
    event.stopPropagation();
    if (this.editedRow === -1) {
      this.editedCampaign = Object.assign({}, this.tableData.content.find(item => item.name === row.name));
      this.editedRow = row.$$index;
    }
  }

  cancelEditing(event: MouseEvent): void {
    event.stopPropagation();
    this.editedRow = -1;
  }

  submitEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.editedRow = -1;
    this.api.put('/campaigns', this.editedCampaign).subscribe(
      () => {
        this.getCampaignsList();
      },
      error => {
        console.error('Update merchant fail', error);
      }
    );
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${CAMPAIGN_ROUTE}`, routeParams]);
  }

  redirectToDetail(event: { selected: any[] }): void {
    if (this.editedRow === -1 && event && event.selected && event.selected.length > 0) {
      this.router.navigateByUrl(`platform/campaigns/${event.selected[0].name}`);
    }
  }

  toggle(event: MouseEvent, row: CampaignModel): void {
    event.stopPropagation();
    this.api.get(`${row.running ? CAMPAIGN_DESTROY_ENDPOINT : CAMPAIGN_START_ENDPOINT}/${row.name}`).subscribe(
      () => {
        this.getCampaignsList();
      },
      (error) => {
        console.error('Error occurred while updating state of import.', error);
      }
    );
  }

  private get requestModel(): RequestOptions<CampaignPredicateObject> {
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
