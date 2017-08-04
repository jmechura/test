import { Component, Input, OnDestroy } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { issuerDetailActions } from '../../shared/reducers/issuer-detail.reducer';
import { AppStateModel } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { IssuerModel } from '../../shared/models/issuer.model';
import { ActivatedRoute } from '@angular/router';
import { UnsubscribeSubject } from '../../shared/utils';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
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
  isEditing = false;
  editIssuerForm: FormGroup;
  stateOptions: SelectItem[] = [
    {value: 'ENABLED'},
    {value: 'DISABLED'}
  ];
  completeView = true;

  @Input()
  set issuerId(id: string) {
    this.id = id;
    this.completeView = false;
    this.store.dispatch({type: issuerDetailActions.ISSUER_DETAIL_API_GET, payload: this.id});
  }

  constructor(private store: Store<AppStateModel>,
              private fb: FormBuilder,
              private api: ApiService,
              private route: ActivatedRoute,
              private toastr: ExtendedToastrService) {
    this.editIssuerForm = fb.group({
      addressName: [''],
      city: ['', Validators.required],
      code: [{value: '', disabled: true}],
      contactFirstname: [''],
      contactLastname: [''],
      dic: ['', Validators.required],
      email: ['', control => control.value === '' || control.value === null ? null : Validators.email(control)],
      ico: ['', Validators.required],
      maskedClnUse: [false, Validators.required],
      name: [{value: '', disabled: true}],
      passwordHashValidityMinute: [0, Validators.required],
      phone: ['', Validators.pattern(/^\+42[0-9]{10}$/)],
      state: [''],
      street: ['', Validators.required],
      zip: ['', Validators.required],
    });
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: { id: string }) => {
        if (params.id) {
          this.id = params.id;
          this.store.dispatch({type: issuerDetailActions.ISSUER_DETAIL_API_GET, payload: this.id});
        }
      }
    );


    this.store.select('issuerDetail').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<IssuerModel>) => {
        if (error) {
          console.error('Issuer API call has returned error', error);
          return;
        }
        if (data != null) {
          this.issuer = data;
          this.editIssuerForm.patchValue(this.issuer);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  toggleUpdateIssuer(): void {
    this.isEditing = !this.isEditing;
    this.editIssuerForm.patchValue(this.issuer);
  }

  updateIssuer(): void {
    this.api.put('/issuers', {
      ...this.issuer,
      ...this.editIssuerForm.value
    }).subscribe(
      () => {
        this.toastr.success('toastr.success.updateIssuer');
        this.store.dispatch({type: issuerDetailActions.ISSUER_DETAIL_API_GET, payload: this.id});
        this.toggleUpdateIssuer();
      },
      error => {
        this.toastr.error(error);
        console.error('Update issuer fail', error);
      }
    );
  }

  isPresent(value: string): boolean {
    const item = this.editIssuerForm.get(value);
    return item.errors != null && item.errors.required;
  }

}
