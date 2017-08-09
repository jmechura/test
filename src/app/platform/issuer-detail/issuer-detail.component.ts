import { Component, Input, OnDestroy } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { issuerDetailActions } from '../../shared/reducers/issuer-detail.reducer';
import { AppStateModel } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { IssuerModel } from '../../shared/models/issuer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeSubject } from '../../shared/utils';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { ComponentMode } from '../../shared/enums/detail-component-mode.enum';
import { optionalEmailValidator } from '../../shared/validators/optional-email.validator';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

@Component({
  selector: 'mss-issuer-detail',
  templateUrl: './issuer-detail.component.html',
  styleUrls: ['./issuer-detail.component.scss']
})
export class IssuerDetailComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  id: string;
  issuer: IssuerModel;
  editIssuerForm: FormGroup;
  stateOptions: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];
  completeView = true;
  mode = ComponentMode.View;
  ComponentMode = ComponentMode;

  @Input()
  set issuerId(id: string) {
    this.id = id;
    this.completeView = false;
    this.store.dispatch({type: issuerDetailActions.ISSUER_DETAIL_GET_REQUEST, payload: this.id});
    this.mode = ComponentMode.View;
  }

  constructor(private store: Store<AppStateModel>,
              private fb: FormBuilder,
              private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ExtendedToastrService) {
    this.editIssuerForm = fb.group({
      addressName: [''],
      city: ['', Validators.required],
      code: [{value: '', disabled: true}],
      contactFirstname: [''],
      contactLastname: [''],
      dic: ['', Validators.required],
      email: ['', optionalEmailValidator],
      ico: ['', Validators.required],
      maskedClnUse: [false, Validators.required],
      name: ['', Validators.required],
      passwordHashValidityMinute: [0, Validators.required],
      phone: ['', Validators.pattern(/^\+42[0-9]{10}$/)],
      state: [''],
      street: ['', Validators.required],
      zip: ['', Validators.required],
    });
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: { id: string }) => {
        // component is not displayed through router outlet therefore there is no id
        if (!params.id) {
          return;
        }
        if (params.id !== 'create') {
          this.id = params.id;
          this.mode = ComponentMode.View;
          this.store.dispatch({type: issuerDetailActions.ISSUER_DETAIL_GET_REQUEST, payload: this.id});
        } else {
          this.mode = ComponentMode.Create;
          // default is disabled therefore it needs to be enabled when creating
          this.editIssuerForm.get('code').enable();
          this.editIssuerForm.get('name').enable();
        }
      }
    );


    this.store.select('issuerDetail').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<IssuerModel>) => {
        if (error) {
          console.error('Issuer API call has returned error', error);
          return;
        }
        if (data != undefined && !loading) {
          if (this.mode !== ComponentMode.Create) {
            this.issuer = data;
            this.editIssuerForm.patchValue(this.issuer);
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  toggleUpdateIssuer(): void {
    this.mode = this.mode === ComponentMode.View ? ComponentMode.Edit : ComponentMode.View;
    this.editIssuerForm.patchValue(this.issuer);
  }

  handleSaveButton(): void {
    if (this.editIssuerForm.invalid) {
      return;
    }
    if (this.mode === ComponentMode.Edit) {
      this.store.dispatch({
        type: issuerDetailActions.ISSUER_DETAIL_PUT_REQUEST,
        payload: {
          ...this.issuer,
          ...this.editIssuerForm.value
        }
      });
      this.toggleUpdateIssuer();
      this.mode = ComponentMode.View;
    } else {
      this.api.post('/issuers', this.editIssuerForm.value).subscribe(
        (issuer: IssuerModel) => {
          this.toastr.success('toastr.success.createIssuer');
          this.router.navigateByUrl(`/platform/issuers/${issuer.code}`);
        },
        error => {
          this.toastr.error(error);
          console.error('Create issuer fail', error);
        }
      );
    }

  }

  goToTable(): void {
    this.router.navigateByUrl('/platform/issuers');
  }

  isPresent(value: string): boolean {
    const item = this.editIssuerForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

}
