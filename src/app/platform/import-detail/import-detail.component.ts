import { Component, OnDestroy, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { importDetailActions } from '../../shared/reducers/import-detail.reducer';
import { StateModel } from '../../shared/models/state.model';
import { ImportModel } from '../../shared/models/import.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { LanguageService } from '../../shared/services/language.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { importTypeActions } from '../../shared/reducers/import-type.reducer';
import { ApiService } from '../../shared/services/api.service';
import { importPropertyDefActions } from '../../shared/reducers/import-property-def.reducer';
import { PropertyDefModel } from '../../shared/models/property-def.model.';
import { importPropertyActions } from '../../shared/reducers/import-property.reducer';
import { PropertyModel } from '../../shared/models/property.model';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';
import { UnsubscribeSubject } from '../../shared/utils';

const IMPORT_DESTROY_ENDPOINT = '/imports/destroy';
const IMPORT_START_ENDPOINT = '/imports/start';
const IMPORT_ENDPOINT = '/imports';
const PROPERTY_ENDPOINT = '/imports/properties';

@Component({
  selector: 'mss-import-detail',
  templateUrl: './import-detail.component.html',
  styleUrls: ['./import-detail.component.scss']
})
export class ImportDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  importName: string;
  importDetail: ImportModel;
  modalVisible = false;
  importTypes: SelectItem[] = [];
  importEditForm: FormGroup;
  propertyForm: FormArray;
  editingProperties = false;
  properties: PropertyModel[] = [];
  mode = ComponentMode.View;
  ComponentMode = ComponentMode;


  constructor(private route: ActivatedRoute,
              private language: LanguageService,
              private fb: FormBuilder,
              private api: ApiService,
              private router: Router,
              private store: Store<AppStateModel>,
              private toastr: ExtendedToastrService) {
    this.store.dispatch({type: importTypeActions.IMPORT_TYPE_GET_REQUEST});


    this.importEditForm = this.fb.group(
      {
        name: [{value: '', disabled: true}],
        nameRead: [''],
        runAfterStart: [false],
        type: ['']
      }
    );

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: { name: string }) => {
        if (params.name !== 'create') {
          this.importName = params.name;
          this.store.dispatch({type: importDetailActions.IMPORT_DETAIL_GET_REQUEST, payload: this.importName});
          this.mode = ComponentMode.View;
        } else {
          this.mode = ComponentMode.Create;
          this.importEditForm.get('name').enable();
          this.importEditForm.reset();
        }

      }
    );

    this.store.select('importDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<ImportModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving import detail from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          if (this.mode !== ComponentMode.Create) {
            this.importDetail = data.data;
            this.importEditForm.patchValue(this.importDetail);
            this.store.dispatch({type: importPropertyActions.IMPORT_PROPERTY_GET_REQUEST, payload: this.importName});
          }
        }
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

    this.store.select('importPropertyDefs').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<PropertyDefModel[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting imports.`, data.error);
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

    this.store.select('importProperties').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<PropertyModel[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting imports.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.properties = data.data;
        }
      }
    );
  }

  handleImportSubmit(): void {
    if (this.mode === ComponentMode.Edit) {
      this.mode = ComponentMode.View;
      this.store.dispatch({
        type: importDetailActions.IMPORT_DETAIL_PUT_REQUEST,
        payload: Object.assign({}, this.importDetail, this.importEditForm.value)
      });
    } else {
      this.api.post(IMPORT_ENDPOINT, this.importEditForm.value).subscribe(
        (imp: ImportModel) => {
          this.toastr.success('toastr.success.createImport');
          this.router.navigateByUrl(`platform/imports/${imp.name}`);
        },
        (error) => {
          this.toastr.error(error);
          console.error('Error occurred while creating new import.', error);
        }
      );
    }

  }

  toggleImport(): void {
    this.api.get(`${this.importDetail.running ? IMPORT_DESTROY_ENDPOINT : IMPORT_START_ENDPOINT}/${this.importName}`).subscribe(
      () => {
        this.store.dispatch({type: importDetailActions.IMPORT_DETAIL_GET_REQUEST, payload: this.importName});
      },
      (error) => {
        console.error('Error occurred while updating state of import.', error);
      }
    );
  }

  toggleProperties(): void {
    this.editingProperties = !this.editingProperties;
    if (this.editingProperties) {
      this.store.dispatch({
        type: importPropertyDefActions.IMPORT_PROPERTY_DEF_GET_REQUEST,
        payload: this.importDetail.type
      });
    }
  }

  identifyProperty(index: number): number {
    return index;
  }

  updateProperties(): void {
    const payload: PropertyModel[] = this.propertyForm.value.filter(item => item.value !== null).map(propertyGroup => ({
      pk: {
        data: this.importName,
        key: propertyGroup.key
      },
      value: propertyGroup.value
    }));
    this.api.put(PROPERTY_ENDPOINT, payload).subscribe(
      () => {
        this.toastr.success('toastr.success.updateImportProperties');
        this.store.dispatch({type: importPropertyActions.IMPORT_PROPERTY_GET_REQUEST, payload: this.importName});
        this.editingProperties = false;
      },
      (error) => {
        this.toastr.error(error);
        console.error('Error occurred while updating campaign properties', error);
      }
    );
  }

  deleteImport(): void {
    this.api.remove(`${IMPORT_ENDPOINT}/${this.importName}`).subscribe(
      () => {
        this.toastr.success('toastr.success.deleteImport');
        this.router.navigateByUrl('platform/imports');
      },
      (error) => {
        this.toastr.error(error);
        console.error('Error occurred while deleting import.', error);
      }
    );
  }

  goToList(): void {
    this.router.navigateByUrl('platform/imports');
  }

  startEditing(): void {
    this.mode = ComponentMode.Edit;
  }

  cancelEditing(): void {
    this.mode = ComponentMode.View;
    this.importEditForm.patchValue(this.importDetail);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
