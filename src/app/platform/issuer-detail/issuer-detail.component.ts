import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { issuerDetailActions } from '../../shared/reducers/issuer-detail.reducer';
import { AppState } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { fillIssuer, IssuerModel } from '../../shared/models/issuer.model';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mss-issuer-detail',
  templateUrl: './issuer-detail.component.html',
  styleUrls: ['./issuer-detail.component.scss']
})
export class IssuerDetailComponent implements OnDestroy {

  private unsubscribe$ = new Subject<void>();
  id: string;
  issuer: IssuerModel = fillIssuer();
  editIssuer: IssuerModel = fillIssuer();
  isEditing = false;
  editIssuerForm: FormGroup;

  constructor(private store: Store<AppState>, private fb: FormBuilder, private api: ApiService, private route: ActivatedRoute) {
    this.editIssuerForm = fb.group({
      addressName: [''],
      city: [''],
      code: [{value: '', disabled: true}],
      contactFirstname: [''],
      contactLastname: [''],
      dic: [''],
      email: ['', control => control.value === '' ? null : Validators.email(control)],
      ico: [''],
      maskedClnUse: [''],
      name: [{value: '', disabled: true}],
      passwordHashValidityMinutes: [''],
      phone: [''],
      state: [''],
      street: [''],
      zip: [''],
    });
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (params: {id: string}) => {
        this.id = params.id;
        this.store.dispatch({type: issuerDetailActions.ISSUER_DETAIL_API_GET, payload: this.id});
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
          this.editIssuer = JSON.parse(JSON.stringify(this.issuer));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleUpdateIssuer(): void {
    this.isEditing = !this.isEditing;
    this.editIssuer = JSON.parse(JSON.stringify(this.issuer));
  }

  updateIssuer(): void {
    this.api.put('/issuers', this.editIssuer).subscribe(
      () => {
        this.store.dispatch({type: issuerDetailActions.ISSUER_DETAIL_API_GET, payload: this.id});
        this.toggleUpdateIssuer();
      },
      error => {
        console.error('Update merchant fail', error);
      }
    );
  }

  get issuerState(): boolean {
    return this.editIssuer.state === 'ENABLED';
  }

  set issuerState(newState: boolean) {
    this.editIssuer.state = newState ? 'ENABLED' : 'DISABLED';
  }

  isPresent(value: string): boolean {
    const item = this.editIssuerForm.get(value);
    return item.errors != null && item.errors.required;
  }

}
