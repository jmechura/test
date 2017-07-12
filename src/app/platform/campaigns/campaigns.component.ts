import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/app-state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { CampaignModel, CampaignPredicateObject, fillCampaign } from '../../shared/models/campaign.model';
import { campaignsActions } from '../../shared/reducers/campaign.reducer';
import { Subject } from 'rxjs/Subject';
import { StateModel } from '../../shared/models/state.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { campaignFactoriesActions } from '../../shared/reducers/campaign-factories.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { Router } from '@angular/router';
import { LanguageService } from '../../shared/language/language.service';

@Component({
  selector: 'mss-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();

  campaignsRequest: RequestOptions<CampaignPredicateObject> = {
    pagination: {
      number: 10,
      numberOfPages: 0,
      start: 0,
    },
    search: {
      predicateObject: {},
    },
    sort: {}
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

  constructor(private store: Store<AppState>,
              private api: ApiService,
              private router: Router,
              private language: LanguageService,
              fb: FormBuilder) {

    this.newCampaignForm = fb.group({
      name: ['', Validators.required],
      orderCampaign: [0],
      runAfterStart: [false],
    });

    this.store.dispatch({type: campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_REQUEST});
    this.getCampaignsList();

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
          this.rows = this.tableData.content.map(item => Object.assign({}, item));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCampaignsList(): void {
    this.store.dispatch({type: campaignsActions.CAMPAIGNS_GET_REQUEST, payload: this.campaignsRequest});
  }

  getSortedCampaigns(sortInfo: any): void {
    this.campaignsRequest.sort = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
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
    if (this.campaignsRequest.pagination.number === newLimit) {
      return;
    }
    this.campaignsRequest.pagination.number = newLimit;
    this.getCampaignsList();
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

  setPage(pageInfo: any): void {
    this.campaignsRequest.pagination.start = pageInfo.offset * this.campaignsRequest.pagination.number;
    this.getCampaignsList();
  }

  redirectToDetail(event: { selected: any[] }): void {
    if (this.editedRow === -1 && event && event.selected && event.selected.length > 0) {
      this.router.navigateByUrl(`platform/campaigns/${event.selected[0].name}`);
    }
  }
}
