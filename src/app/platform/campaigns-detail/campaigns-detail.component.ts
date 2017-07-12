import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { campaignDetailActions } from '../../shared/reducers/campaign-detail.reducer';
import { CampaignModel } from '../../shared/models/campaign.model';
import { StateModel } from '../../shared/models/state.model';
import { campaignPropertyDefActions } from '../../shared/reducers/campaign-property-def.reducer';
import { PropertyDefModel } from '../../shared/models/property-def.model.';
import { campaignPropertyActions } from '../../shared/reducers/campaign-property.reducer';
import { PropertyModel } from '../../shared/models/property.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { campaignFactoriesActions } from '../../shared/reducers/campaign-factories.reducer';
import { ApiService } from '../../shared/services/api.service';

const PROPERTY_ENDPOINT = '/campaigns/properties';
const CAMPAIGNS_ENDPOINT = '/campaigns';

@Component({
  selector: 'mss-campaigns-detail',
  templateUrl: './campaigns-detail.component.html',
  styleUrls: ['./campaigns-detail.component.scss']
})
export class CampaignsDetailComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  campaignName = '';
  campaignDetail: CampaignModel;
  properties: PropertyModel[] = [];
  campaingForm: FormGroup;
  campaignFactories: SelectItem[] = [];
  editingCampaign = false;
  editingProperties = false;
  propertyForm: FormArray;
  modalVisible = false;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private store: Store<AppState>,
              private router: Router,
              private api: ApiService) {
    this.store.dispatch({type: campaignFactoriesActions.CAMPAIGN_FACTORIES_GET_REQUEST});
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      params => {
        this.campaignName = params.name;
        this.store.dispatch({type: campaignDetailActions.CAMPAIGN_DETAIL_GET_REQUEST, payload: this.campaignName});
      }
    );

    this.store.select('campaignDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CampaignModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving campaign detail from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.campaignDetail = data.data;
          this.campaingForm.patchValue(this.campaignDetail);
          this.store.dispatch({type: campaignPropertyActions.CAMPAIGN_PROPERTY_GET_REQUEST, payload: this.campaignDetail.name});
        }
      }
    );

    this.store.select('campaignPropertyDefs').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<PropertyDefModel[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving campaign property defs from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.propertyForm = this.fb.array(data.data.map(
            (propertyDef: PropertyDefModel) => {
              const userProperty = this.properties.find(property => property.pk.key === propertyDef.key);
              return this.fb.group({
                key: propertyDef.key,
                type: propertyDef.type,
                value: [
                  userProperty ? userProperty.value : propertyDef.defaultValue,
                  ...propertyDef.required ? [Validators.required] : []
                ]
              });
            }
          ));
        }
      }
    );

    this.store.select('campaignProperties').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<PropertyModel[]>) => {
        if (data.error) {
          console.error('Error occurred while retrieving campaign properties from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.properties = data.data;
        }
      }
    );

    this.store.select('campaignFactories').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error('Error occured while retrieving campaing factories from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.campaignFactories = data.data.map(item => ({value: item}));
        }
      }
    );

    this.campaingForm = fb.group(
      {
        name: [{value: '', disabled: true}],
        campaignName: ['DEFAULT', Validators.required],
        orderCampaign: [0],
        runAfterStart: [false]
      }
    );

  }

  editCampaign(): void {
    this.store.dispatch({
      type: campaignDetailActions.CAMPAIGN_DETAIL_PUT_REQUEST,
      payload: Object.assign({}, this.campaignDetail, this.campaingForm.value)
    });
  }

  deleteCampaign(): void {
    this.api.remove(`${CAMPAIGNS_ENDPOINT}/${this.campaignName}`).subscribe(
      () => {
        this.router.navigateByUrl('platform/campaigns');
      },
      (error) => {
        console.error('Error occured while deleting campaign.', error);
      }
    );
  }

  toggleProperties(): void {
    this.editingProperties = !this.editingProperties;
    if (this.editingProperties) {
      this.store.dispatch({
        type: campaignPropertyDefActions.CAMPAIGN_PROPERTY_DEF_GET_REQUEST,
        payload: this.campaignDetail.campaignName
      });
    }
  }

  updateProperties(): void {
    const payload: PropertyModel[] = this.propertyForm.value.map(propertyGroup => ({
      pk: {
        data: this.campaignName,
        key: propertyGroup.key
      },
      value: propertyGroup.value
    }));

    this.api.put(PROPERTY_ENDPOINT, payload).subscribe(
      () => {
        // TODO indicate success, dude!
        this.store.dispatch({type: campaignPropertyActions.CAMPAIGN_PROPERTY_GET_REQUEST, payload: this.campaignDetail.name});
        this.editingProperties = false;
      },
      error => {
        console.error(error);
      }
    );
  }

  identifyProperty(index: number): number {
    return index;
  }

  toggleCampaign(): void {
    this.store.dispatch({
      type: campaignDetailActions.CAMPAIGN_DETAIL_TOGGLE_GET_REQUEST,
      payload: {
        name: this.campaignDetail.name, action: this.campaignDetail.running ? 'destroy' : 'start'
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
