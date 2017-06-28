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

  campaigns: CampaignModel[] = [];

  campaignFactories: SelectItem[] = [{value: 'UNKNOWN'}];

  rowLimit = 10;
  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];

  rows = [];

  editedRow = -1;
  editedCampaign: CampaignModel = fillCampaign();

  loading = false;

  constructor(private store: Store<AppState>, private api: ApiService, fb: FormBuilder) {

    this.newCampaignForm = fb.group({
      name: ['', Validators.required],
      orderCampaign: [0],
      runAfterStart: [false],
    });

    this.store.dispatch({type: campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_REQUEST});
    this.dispatchCampaingsListGet();

    this.store.select('campaignFactories').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('Campaign Factories API call has returned error', error);
          return;
        }

        if (data != undefined) {
          this.campaignFactories = data.map(item => ({value: item}));
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
          this.campaigns = data.content;
          this.rows = this.campaigns.map(item => Object.assign({}, item));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  dispatchCampaingsListGet(): void {
    this.store.dispatch({type: campaignsActions.CAMPAIGNS_GET_REQUEST, payload: this.campaignsRequest});
  }

  toggleNewCampaignForm(): void {
    this.newCampaignModalShowing = !this.newCampaignModalShowing;
  }

  addCampaign(): void {
    this.api.post('/campaigns', this.newCampaign).subscribe(
      () => {
        this.dispatchCampaingsListGet();
        ;
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

  deleteCampaign(name: string): void {
    this.api.remove(`/campaigns/${name}`).subscribe(
      () => {
        this.dispatchCampaingsListGet();
        ;
      },
      error => {
        console.error('Delete campaign fail', error);
      }
    );
  }

  changeLimit(newLimit: number): void {
    this.rowLimit = newLimit;
  }

  startEditing(row: any): void {
    if (this.editedRow === -1) {
      this.editedCampaign = Object.assign({}, this.campaigns.find(item => item.name === row.name));
      this.editedRow = row.$$index;
    }
  }

  cancelEditing(): void {
    this.editedRow = -1;
  }

  submitEdit(row: any): void {
    this.editedRow = -1;
    this.api.put('/campaigns', this.editedCampaign).subscribe(
      () => {
        this.dispatchCampaingsListGet();
      },
      error => {
        console.error('Update merchant fail', error);
      }
    );
  }
}
