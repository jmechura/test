import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { CampaignModel, CampaignPredicateObject } from '../../shared/models/campaign.model';
import { campaignsActions } from '../../shared/reducers/campaign.reducer';
import { StateModel } from '../../shared/models/state.model';
import { ApiService } from '../../shared/services/api.service';
import { UnsubscribeSubject } from '../../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRouteParamsModel } from '../../shared/models/list-route-params.model';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

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
  rows = [];
  loading = false;
  warnModalVisible = false;
  deletingCampaignName: string;

  constructor(private store: Store<AppStateModel>,
              private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ExtendedToastrService) {

    this.store.select('campaigns').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<CampaignModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Campaigns API call has returned error', error);
          return;
        }

        if (data != undefined && !loading) {
          this.totalItems = data.totalElements;
          this.rows = data.content.map(item => Object.assign({}, item));
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

  showDeleteModal(event: MouseEvent, name: string): void {
    event.stopPropagation();
    this.deletingCampaignName = name;
    this.warnModalVisible = true;
  }

  deleteCampaign(): void {
    this.api.remove(`/campaigns/${this.deletingCampaignName}`).subscribe(
      () => {
        this.toastr.success('toastr.success.deleteCampaign');
        this.getCampaignsList();
        this.warnModalVisible = false;
      },
      error => {
        this.toastr.error(error);
        console.error('Delete campaign fail', error);
        this.warnModalVisible = false;
      }
    );
  }

  goToCreate(): void {
    this.router.navigateByUrl('platform/campaigns/create');
  }

  changeLimit(newLimit: number): void {
    const routeParams: ListRouteParamsModel = {
      page: '1',
      limit: String(newLimit)
    };
    this.router.navigate([`${CAMPAIGN_ROUTE}`, routeParams]);
  }

  setPage(pageInfo: { offset: number }): void {
    const routeParams: ListRouteParamsModel = {
      page: String(pageInfo.offset + 1),
      limit: String(this.rowLimit)
    };
    this.router.navigate([`${CAMPAIGN_ROUTE}`, routeParams]);
  }

  redirectToDetail(event: { selected: any[] }): void {
    if (event && event.selected && event.selected.length > 0) {
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
