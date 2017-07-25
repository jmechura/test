import { Component, OnDestroy } from '@angular/core';
import { UnsubscribeSubject } from '../../shared/utils';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { TemplateModel } from '../../shared/models/template.model';
import { ActivatedRoute, Params } from '@angular/router';
import { templateDetailActions } from '../../shared/reducers/template-detail.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { TemplateSections } from '../../shared/enums/template-sections.enum';
import { LanguageService } from '../../shared/services/language.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { userAuthorityActions } from '../../shared/reducers/user-authorities.reducer';
import { userResourceActions } from '../../shared/reducers/user-resource.reducer';
import { systemsActions } from '../../shared/reducers/system.reducer';
import { SystemModel } from '../../shared/models/system.model';
import { configurationTypeActions } from '../../shared/reducers/configuration-type.reducer';
import { ConfigurationModel } from '../../shared/models/configuration.model';
import { configurationActions } from '../../shared/reducers/configuration.reducer';
import { configurationInstanceActions } from '../../shared/reducers/configuration-instance.reducer';

@Component({
  selector: 'mss-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss']
})
export class TemplateDetailComponent implements OnDestroy {

  currentlyDisplayedConfigResourceId = null;
  templateDetail: TemplateModel;
  templateSections: SelectItem[] = [];
  visibleTab: SelectItem;
  TemplateSections = TemplateSections;

  editFormVisible = false;
  templateForm: FormGroup;
  newConfigurationForm: FormGroup;
  resourcesArray: SelectItem[] = [];
  rolesArray: SelectItem[] = [];
  systemsArray: SelectItem[] = [];
  resourceOptions: SelectItem[] = [];
  selectedResource = 0;
  configurationTypes: SelectItem[] = [];
  configurations: ConfigurationModel[] = [];
  configurationInstances: SelectItem[] = [];
  resourceConfigurationOptions: SelectItem[] = [];
  addConfigurationModalShowing = false;
  configurationsLoading = false;
  deleteConfigurationModalShowing = false;
  deleteConfigurationId: number = null;
  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private store: Store<AppStateModel>,
              private language: LanguageService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {

    this.templateForm = fb.group({
      code: [{value: '', disabled: true}, Validators.required],
      description: [''],
      name: ['', Validators.required],
      resource: [''],
      resources: fb.array([
        fb.group({
          resource: '',
          roles: fb.array([
            ''
          ]),
          id: 0
        })
      ]),
      system: [''],
      systemReceiver: ['']
    });

    this.newConfigurationForm = fb.group({
      type: ['', Validators.required],
      name: [{value: '', disabled: true}, Validators.required],
      resource: ['', Validators.required],
      userAuthorityResourceId: 0
    });

    this.store.select('templateDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<TemplateModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving template detail.', data.error);
          return;
        }

        if (data.data != undefined && !data.loading) {
          this.templateDetail = data.data;
          this.templateForm.patchValue(this.templateDetail);
          // simple patch doesnt work for nested arrays
          this.templateDetail.resources.forEach(
            (res, index) => {
              (<FormArray>this.templateForm.get('resources')).setControl(index, this.fb.group({
                resource: res.resource,
                id: res.id,
                roles: this.fb.array(res.roles)
              }));
            }
          );
          this.resourceOptions = this.templateDetail.resources.map((res, index) => ({value: index, label: res.resource}));
          this.resourceConfigurationOptions = this.templateDetail.resources.map(res => ({value: res.id, label: res.resource}));
        }
      }
    );

    this.store.select('userAuthority').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<string[]>) => {
        if (error) {
          console.error('User authority API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          this.rolesArray = data.map(val => ({value: val}));
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
        }
      }
    );
    this.store.select('systems').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<SystemModel[]>) => {
        if (error) {
          console.error('System API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          this.systemsArray = data.map(val => ({value: val.name}));
        }
      }
    );

    this.store.select('configurationTypes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<string[]>) => {
        if (error) {
          console.error('Configuration types API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          this.configurationTypes = data.map(type => ({value: type}));
        }
      }
    );

    this.store.select('configurations').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<ConfigurationModel[]>) => {
        this.configurationsLoading = loading;
        if (error) {
          console.error('Configurations API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          this.configurations = data.map(item => item);
          if (this.deleteConfigurationId != null) {
            this.deleteConfigurationId = null;
            this.store.dispatch({
              type: configurationActions.CONFIGURATIONS_GET_REQUEST,
              payload: this.currentlyDisplayedConfigResourceId
            });
          }
        }
      }
    );

    this.store.select('configurationInstances').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<string[]>) => {
        if (error) {
          console.error('Configurations instances API call has returned error', error);
          return;
        }
        if (data != null && !loading) {
          this.newConfigurationForm.get('name').enable();
          this.configurationInstances = data.map(item => ({value: item}));
        }
      }
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: Params) => {
        this.store.dispatch({type: templateDetailActions.TEMPLATE_DETAIL_GET_REQUEST, payload: params.id});
      }
    );

    this.templateSections = Object.keys(TemplateSections).filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`templates.detail.sections.${item}`),
        value: TemplateSections[item]
      }));
    this.visibleTab = this.templateSections[0];

    this.store.dispatch({type: userAuthorityActions.USER_AUTHORITY_GET_REQUEST});
    this.store.dispatch({type: userResourceActions.USER_RESOURCE_GET_REQUEST});
    this.store.dispatch({type: systemsActions.SYSTEMS_GET_REQUEST});
    this.store.dispatch({type: configurationTypeActions.CONFIGURATION_TYPE_GET_REQUEST});
  }

  editTemplate(): void {
    this.store.dispatch({
      type: templateDetailActions.TEMPLATE_DETAIL_PUT_REQUEST,
      payload: {...this.templateDetail, ...this.templateForm.value}
    });
    this.editFormVisible = false;
  }

  get resources(): FormArray {
    return this.templateForm.get('resources') as FormArray;
  };

  getRoles(res: FormControl): FormArray {
    return res.get('roles') as FormArray;
  }

  addRole(res: FormControl): void {
    this.getRoles(res).push(new FormControl(this.rolesArray[0].value));
  }

  addResource(): void {
    this.resources.push(this.fb.group({
      resource: this.resourcesArray[0].value,
      roles: this.fb.array([
        this.rolesArray[0].value
      ])
    }));
  }

  removeResource(index: number): void {
    this.resources.removeAt(index);
  }

  removeRole(res: FormControl, index: number): void {
    this.getRoles(res).removeAt(index);
  }

  isPresent(value: string): boolean {
    const item = this.templateForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  identifyRole(index: number, item: FormControl): FormControl {
    return item;
  }

  identifyResource(index: number, item: FormControl): FormControl {
    return item;
  }

  toggleAddConfigurationModal(): void {
    this.addConfigurationModalShowing = !this.addConfigurationModalShowing;
  }

  onConfigurationTypeSelect(type: string): void {
    if (type != null && type.length > 0) {
      this.store.dispatch({type: configurationInstanceActions.CONFIGURATION_INSTANCE_GET_REQUEST, payload: type});
    } else {
      this.newConfigurationForm.get('name').disable();
    }
  }

  onConfigurationResourceSelect(resourceId: number): void {
    if (resourceId != null) {
      const resource = this.resourceConfigurationOptions.find(item => item.value === resourceId);
      if (resource != null) {
        this.newConfigurationForm.get('resource').patchValue(resource.label);
      }
    }
  }

  isPresentConfig(value: string): boolean {
    const item = this.newConfigurationForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  displayedResourceChange(resourceId: number): void {
    if (resourceId != null) {
      this.currentlyDisplayedConfigResourceId = resourceId;
      this.store.dispatch({type: configurationActions.CONFIGURATIONS_GET_REQUEST, payload: resourceId});
    }
  }

  confirmConfigurationAdd(): void {
    this.store.dispatch({type: configurationActions.CONFIGURATIONS_CREATE_REQUEST, payload: [this.newConfigurationForm.value]});
    this.toggleAddConfigurationModal();
    if (this.currentlyDisplayedConfigResourceId != null) {
      this.store.dispatch({type: configurationActions.CONFIGURATIONS_GET_REQUEST, payload: this.currentlyDisplayedConfigResourceId});
    }
  }

  confirmConfigurationDelete(): void {
    this.store.dispatch({type: configurationActions.CONFIGURATIONS_DELETE_REQUEST, payload: this.deleteConfigurationId});
    this.toggleDeleteConfigurationModal();
  }

  toggleDeleteConfigurationModal(): void {
    this.deleteConfigurationModalShowing = !this.deleteConfigurationModalShowing;
  }

  deleteConfiguration(row: any): void {
    this.deleteConfigurationId = row.id;
    this.toggleDeleteConfigurationModal();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
