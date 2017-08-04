import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { Subject } from 'rxjs';
import { StateModel } from '../../shared/models/state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { TemplateModel, TemplatePredicateObject } from '../../shared/models/template.model';
import { templatesActions } from '../../shared/reducers/template.reducer';
import { userAuthorityActions } from '../../shared/reducers/user-authorities.reducer';
import { userResourceActions } from '../../shared/reducers/user-resource.reducer';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { SystemModel } from '../../shared/models/system.model';
import { systemsActions } from '../../shared/reducers/system.reducer';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

interface Role {
  value: string;
}

@Component({
  selector: 'mss-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  loading = true;
  templates: TemplateModel[] = [];
  resourcesArray: SelectItem[] = [];
  rolesArray: SelectItem[] = [];
  systemsArray: SelectItem[] = [];
  newTemplateForm: FormGroup;
  newTemplateModalShowing = false;

  templatesRequest: RequestOptions<TemplatePredicateObject> = {
    pagination: {
      number: 5,
      numberOfPages: 0,
      start: 0,
    },
    search: {
      predicateObject: {},
    },
    sort: {}
  };
  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
  totalElements = 0;

  constructor(private store: Store<AppStateModel>,
              private router: Router,
              private fb: FormBuilder,
              private api: ApiService,
              private toastr: ExtendedToastrService) {
    this.newTemplateForm = fb.group({
      code: ['', Validators.required],
      description: [''],
      name: ['', Validators.required],
      resource: [''],
      resources: fb.array([
        fb.group({
          resource: '',
          roles: fb.array([
            ''
          ])
        })
      ]),
      system: [''],
      systemReceiver: ['']
    });
    this.store.select('templates').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<TemplateModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Template API call has returned error', error);
          return;
        }
        if (data != null) {
          this.templates = data.content;
          this.totalElements = data.totalElements;
        }
      }
    );
    this.store.select('userAuthority').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('User authority API call has returned error', error);
          return;
        }
        if (data != null) {
          this.rolesArray = data.map(val => ({value: val}));
          this.newTemplateForm.patchValue({
            resources: [{roles: [this.rolesArray[0].value]}]
          });
        }
      }
    );
    this.store.select('userResource').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('User resource API call has returned error', error);
          return;
        }
        if (data != null) {
          this.resourcesArray = data.map(val => ({value: val}));
          this.newTemplateForm.patchValue({
            resource: this.resourcesArray[0].value,
            resources: [{resource: this.resourcesArray[0].value}]
          });
        }
      }
    );
    this.store.select('systems').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<SystemModel[]>) => {
        if (error) {
          console.error('System API call has returned error', error);
          return;
        }
        if (data != null) {
          this.systemsArray = data.map(val => ({value: val.name}));
          this.newTemplateForm.patchValue({
            system: this.systemsArray[0].value,
            systemReceiver: this.systemsArray[0].value,
          });
        }
      }
    );
    this.store.dispatch({type: templatesActions.TEMPLATES_GET_REQUEST, payload: this.templatesRequest});
    this.store.dispatch({type: userAuthorityActions.USER_AUTHORITY_GET_REQUEST});
    this.store.dispatch({type: userResourceActions.USER_RESOURCE_GET_REQUEST});
    this.store.dispatch({type: systemsActions.SYSTEMS_GET_REQUEST});
  }

  get resources(): FormArray {
    return this.newTemplateForm.get('resources') as FormArray;
  };

  getRoles(res: FormControl): FormArray {
    return res.get('roles') as FormArray;
  }

  addResource(): void {
    this.resources.push(this.fb.group({
      resource: this.resourcesArray[0].value,
      roles: this.fb.array([
        this.rolesArray[0].value
      ])
    }));
  }

  addRole(res: FormControl): void {
    this.getRoles(res).push(new FormControl(this.rolesArray[0].value));
  }

  removeResource(index: number): void {
    this.resources.removeAt(index);
  }

  removeRole(res: FormControl, index: number): void {
    this.getRoles(res).removeAt(index);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleNewTemplateModal(): void {
    this.newTemplateModalShowing = !this.newTemplateModalShowing;
  }

  changeLimit(limit: number): void {
    if (this.templatesRequest.pagination.number === limit) {
      return;
    }
    this.templatesRequest.pagination.number = limit;
    this.store.dispatch({type: templatesActions.TEMPLATES_GET_REQUEST, payload: this.templatesRequest});
  }

  onSelect({selected}: { selected: TemplateModel[] }): void {
    if (selected && selected.length > 0) {
      this.router.navigateByUrl(`/platform/templates/detail/${selected[0].id}`);
    }
  }

  setPage(pageInfo: any): void {
    this.templatesRequest.pagination.start = pageInfo.offset * this.templatesRequest.pagination.number;
    this.store.dispatch({type: templatesActions.TEMPLATES_GET_REQUEST, payload: this.templatesRequest});
  }

  identifyRole(index: number): number {
    return index;
  }

  identifyResource(index: number): number {
    return index;
  }

  addTemplate(): void {
    this.api.post('/users/templates', this.newTemplateForm.value).subscribe(
      () => {
        this.toastr.success('toastr.success.createTemplate');
        this.newTemplateForm.reset();
        this.store.dispatch({type: templatesActions.TEMPLATES_GET_REQUEST, payload: this.templatesRequest});
      },
      error => {
        this.toastr.error(error);
        console.error('Create template fail', error);
      }
    );
    this.toggleNewTemplateModal();
  }

  isPresent(value: string): boolean {
    const item = this.newTemplateForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

}
