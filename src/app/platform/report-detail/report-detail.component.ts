import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { reportDetailActions } from '../../shared/reducers/report-detail.reducer';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { AdminReportModel } from '../../shared/models/admin-report.model';
import { StateModel } from '../../shared/models/state.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { reportTypeActions } from '../../shared/reducers/report-types.reducer';
import { reportPropertyActions } from '../../shared/reducers/report-property.reducer';
import { PropertyModel } from '../../shared/models/property.model';
import { reportPropertyDefActions } from '../../shared/reducers/report-property-def.reducer';
import { PropertyDefModel } from '../../shared/models/property-def.model.';
import { ApiService } from '../../shared/services/api.service';
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';

const REPORT_DESTROY_ENDPOINT = '/reports/destroy';
const REPORT_START_ENDPOINT = '/reports/start';
const REPORT_ENDPOINT = '/reports';
const PROPERTY_ENDPOINT = '/reports/properties';

@Component({
  selector: 'mss-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  reportName: string;
  reportDetail: AdminReportModel;
  reportEditForm: FormGroup;
  reportTypes: SelectItem[] = [];
  reportModalVisible = false;
  properties: PropertyModel[] = [];
  propertyForm: FormArray;
  editingProperties = false;
  mode = ComponentMode.View;
  ComponentMode = ComponentMode;

  constructor(private route: ActivatedRoute,
              private language: LanguageService,
              private fb: FormBuilder,
              private router: Router,
              private api: ApiService,
              private store: Store<AppStateModel>,
              private toastr: ExtendedToastrService) {

    this.reportEditForm = this.fb.group(
      {
        name: [{value: '', disabled: true}],
        runAfterStart: [false],
        type: ['']
      }
    );

    this.store.dispatch({type: reportTypeActions.REPORT_TYPE_GET_REQUEST});
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: { name: string }) => {
        if (params.name !== 'create') {
          this.reportName = params.name;
          this.store.dispatch({type: reportDetailActions.REPORTS_DETAIL_GET_REQUEST, payload: this.reportName});
          this.mode = ComponentMode.View;
        } else {
          this.mode = ComponentMode.Create;
          this.reportEditForm.get('name').enable();
          this.reportEditForm.reset();
        }

      }
    );

    this.store.select('reportDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<AdminReportModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving import detail from API.', data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          if (this.mode !== ComponentMode.Create) {
            this.reportDetail = data.data;
            this.reportEditForm.patchValue(this.reportDetail);
            this.store.dispatch({type: reportPropertyActions.REPORT_PROPERTY_GET_REQUEST, payload: this.reportName});
          }
        }
      }
    );

    this.store.select('reportTypes').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<string[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting imports.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.reportTypes = data.data.map(item => ({
            value: item,
            label: this.language.translate(`enums.reportTypes.${item}`)
          }));
        }
      }
    );

    this.store.select('reportProperties').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<PropertyModel[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting report properties.`, data.error);
          return;
        }
        if (data.data !== undefined && !data.loading) {
          this.properties = data.data;
        }
      }
    );

    this.store.select('reportPropertyDefs').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<PropertyDefModel[]>) => {
        if (data.error) {
          console.error(`Error occurred while getting report property defs.`, data.error);
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
                  (propertyDef.type === 'LIST_STRING') ? value.split(',') : value,
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
  }

  identifyProperty(index: number): number {
    return index;
  }

  toggleProperties(): void {
    this.editingProperties = !this.editingProperties;
    if (this.editingProperties) {
      this.store.dispatch({
        type: reportPropertyDefActions.REPORT_PROPERTY_DEF_GET_REQUEST,
        payload: this.reportDetail.type
      });
    }
  }

  updateProperties(): void {
    // null is because of optional properties which we don't want to send to api unless filled
    const payload: PropertyModel[] = this.propertyForm.value.filter(item => item.value !== null).map(propertyGroup => ({
      pk: {
        data: this.reportName,
        key: propertyGroup.key
      },
      value: (propertyGroup.value instanceof Array) ? propertyGroup.value.join(',') : propertyGroup.value
    }));
    this.api.post(PROPERTY_ENDPOINT, payload).subscribe(
      () => {
        this.toastr.success('toastr.success.updateReportProperties');
        this.store.dispatch({type: reportPropertyActions.REPORT_PROPERTY_GET_REQUEST, payload: this.reportName});
        this.editingProperties = false;
      },
      (error) => {
        this.toastr.error(error);
        console.error('Error occurred while updating campaign properties', error);
        this.editingProperties = false;
      }
    );
  }

  toggleReport(): void {
    this.api.get(`${this.reportDetail.running ? REPORT_DESTROY_ENDPOINT : REPORT_START_ENDPOINT}/${this.reportName}`).subscribe(
      () => {
        this.store.dispatch({type: reportDetailActions.REPORTS_DETAIL_GET_REQUEST, payload: this.reportName});
      },
      (error) => {
        console.error('Error occurred while updating state of import.', error);
      }
    );
  }

  deleteReport(): void {
    this.api.remove(`${REPORT_ENDPOINT}/${this.reportName}`).subscribe(
      () => {
        this.toastr.success('toastr.success.deleteReport');
        this.reportModalVisible = false;
        this.router.navigateByUrl('platform/imports');
      },
      (error) => {
        this.toastr.error(error);
        this.reportModalVisible = false;
        console.error('Error occurred while deleting import.', error);
      }
    );
  }

  handleReportSubmit(): void {
    if (this.mode === ComponentMode.Edit) {
      this.mode = ComponentMode.View;
      this.store.dispatch({
        type: reportDetailActions.REPORT_DETAIL_PUT_REQUEST,
        payload: Object.assign({}, this.reportDetail, this.reportEditForm.value)
      });
    } else {
      this.api.post(REPORT_ENDPOINT, this.reportEditForm.value).subscribe(
        (report: AdminReportModel) => {
          this.toastr.success('toastr.success.addReport');
          this.router.navigateByUrl(`platform/admin-reports/${report.name}`);
        },
        (error) => {
          console.error('Error occurred while creating new report.', error);
          this.toastr.error(error);
        }
      );
    }

  }

  goToList(): void {
    this.router.navigateByUrl('platform/admin-reports');
  }

  startEditing(): void {
    this.mode = ComponentMode.Edit;
  }

  cancelEditing(): void {
    this.mode = ComponentMode.View;
    this.reportEditForm.patchValue(this.reportDetail);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
