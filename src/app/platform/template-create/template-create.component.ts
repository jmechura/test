import { Component, OnDestroy } from '@angular/core';
import { UnsubscribeSubject } from '../../shared/utils';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { ApiService } from '../../shared/services/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { SystemModel } from '../../shared/models/system.model';
import { StateModel } from '../../shared/models/state.model';
import { userAuthorityActions } from '../../shared/reducers/user-authorities.reducer';
import { userResourceActions } from '../../shared/reducers/user-resource.reducer';
import { systemsActions } from '../../shared/reducers/system.reducer';
import { Router } from '@angular/router';
import { TemplateModel } from '../../shared/models/template.model';

@Component({
  selector: 'mss-template-create',
  templateUrl: './template-create.component.html',
  styleUrls: ['./template-create.component.scss']
})
export class TemplateCreateComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  templateForm: FormGroup;
  resourcesArray: SelectItem[] = [];
  rolesArray: SelectItem[] = [];
  systemsArray: SelectItem[] = [];

  constructor(private store: Store<AppStateModel>,
              private fb: FormBuilder,
              private router: Router,
              private api: ApiService) {
    this.templateForm = fb.group({
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

    this.store.select('userAuthority').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('User authority API call has returned error', error);
          return;
        }
        if (data != null) {
          this.rolesArray = data.map(val => ({value: val}));
          this.templateForm.patchValue({
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
          this.templateForm.patchValue({
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
          this.templateForm.patchValue({
            system: this.systemsArray[0].value,
            systemReceiver: this.systemsArray[0].value,
          });
        }
      }
    );

    this.store.dispatch({type: userAuthorityActions.USER_AUTHORITY_GET_REQUEST});
    this.store.dispatch({type: userResourceActions.USER_RESOURCE_GET_REQUEST});
    this.store.dispatch({type: systemsActions.SYSTEMS_GET_REQUEST});

  }

  isPresent(value: string): boolean {
    const item = this.templateForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  get resources(): FormArray {
    return this.templateForm.get('resources') as FormArray;
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

  identifyRole(index: number, item: FormControl): FormControl {
    return item;
  }

  identifyResource(index: number, item: FormControl): FormControl {
    return item;
  }

  removeResource(index: number): void {
    this.resources.removeAt(index);
  }

  removeRole(res: FormControl, index: number): void {
    this.getRoles(res).removeAt(index);
    this.templateForm.patchValue(this.templateForm.value);
  }

  addRole(res: FormControl): void {
    this.getRoles(res).push(new FormControl(this.rolesArray[0].value));
  }

  addTemplate(): void {
    this.api.post('/users/templates', this.templateForm.value).subscribe(
      (template: TemplateModel) => {
        this.router.navigateByUrl(`platform/templates/detail/${template.id}`);
      },
      error => {
        console.error('Create template fail', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
