import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AppStateModel } from '../../shared/models/app-state.model';
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
import { LanguageService } from '../../shared/services/language.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

const PROPERTY_ENDPOINT = '/campaigns/properties';
const CAMPAIGNS_ENDPOINT = '/campaigns';
const CAMPAIGN_DESTROY_ENDPOINT = '/campaigns/destroy';
const CAMPAIGN_START_ENDPOINT = '/campaigns/start';

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
              private store: Store<AppStateModel>,
              private router: Router,
              private language: LanguageService,
              private api: ApiService,
              private toastr: ExtendedToastrService) {
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
              const value = userProperty ? userProperty.value : (propertyDef.required ? propertyDef.defaultValue : null);
              return this.fb.group({
                key: propertyDef.key,
                type: propertyDef.type,
                value: [
                  value,
                  ...propertyDef.required ? [Validators.required] : []
                ],
                required: propertyDef.required,
                placeholder: propertyDef.defaultValue,
                data: [propertyDef.datas ? propertyDef.datas.map(item => ({value: item})) : null]
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
          this.campaignFactories = data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.campaignFactories.${item}`)
          }));
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
    this.editingCampaign = false;
    this.store.dispatch({
      type: campaignDetailActions.CAMPAIGN_DETAIL_PUT_REQUEST,
      payload: Object.assign({}, this.campaignDetail, this.campaingForm.value)
    });
  }

  deleteCampaign(): void {
    this.api.remove(`${CAMPAIGNS_ENDPOINT}/${this.campaignName}`).subscribe(
      () => {
        this.toastr.success('toastr.success.deleteCampaign');
        this.router.navigateByUrl('platform/campaigns');
      },
      (error) => {
        this.toastr.error(error);
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
    const payload: PropertyModel[] = this.propertyForm.value.filter(item => item.value !== null).map(propertyGroup => ({
      pk: {
        data: this.campaignName,
        key: propertyGroup.key
      },
      value: propertyGroup.value
    }));

    this.api.put(PROPERTY_ENDPOINT, payload).subscribe(
      () => {
        this.toastr.success('toastr.success.updateCampaignProperties');
        this.store.dispatch({type: campaignPropertyActions.CAMPAIGN_PROPERTY_GET_REQUEST, payload: this.campaignDetail.name});
        this.editingProperties = false;
      },
      error => {
        this.toastr.error(error);
        console.error(error);
      }
    );
  }

  identifyProperty(index: number): number {
    return index;
  }

  toggleCampaign(): void {
    this.api.get(`${this.campaignDetail.running ? CAMPAIGN_DESTROY_ENDPOINT : CAMPAIGN_START_ENDPOINT}/${this.campaignName}`).subscribe(
      () => {
        this.store.dispatch({type: campaignDetailActions.CAMPAIGN_DETAIL_GET_REQUEST, payload: this.campaignName});
      },
      (error) => {
        console.error('Error occurred while toggling campaign.', error);
      }
    );
  }

  startEditing(): void {
    this.editingCampaign = true;
  }

  cancelEditing(): void {
    this.editingCampaign = false;
    this.campaingForm.patchValue(this.campaignDetail);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
