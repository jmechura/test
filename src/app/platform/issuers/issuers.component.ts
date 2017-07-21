import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { StateModel } from '../../shared/models/state.model';
import { Pagination, RequestOptions } from '../../shared/models/pagination.model';
import { issuersActions } from '../../shared/reducers/issuer.reducer';
import { IssuerModel, IssuerPredicateObject } from '../../shared/models/issuer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { UnsubscribeSubject } from '../../shared/utils';

@Component({
  selector: 'mss-issuers',
  templateUrl: './issuers.component.html',
  styleUrls: ['./issuers.component.scss'],
})
export class IssuersComponent implements OnDestroy {

  tableData: Pagination<IssuerModel>;
  issuers: IssuerModel[] = [];
  newIssuerModalShowing = false;
  newIssuerForm: FormGroup;
  private unsubscribe$ = new UnsubscribeSubject();
  issuersRequest: RequestOptions<IssuerPredicateObject> = {
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
  loading = true;
  rows = [];

  constructor(private store: Store<AppStateModel>, private router: Router, private fb: FormBuilder, private api: ApiService) {
    this.newIssuerForm = fb.group({
      addressName: [''],
      city: ['', Validators.required],
      code: ['', Validators.required],
      contactFirstname: [''],
      contactLastname: [''],
      dic: ['', Validators.required],
      email: ['', control => control.value === '' ? null : Validators.email(control)],
      ico: ['', Validators.required],
      maskedClnUse: [''],
      name: ['', Validators.required],
      passwordHashValidityMinutes: [0],
      phone: ['', Validators.pattern(/^\+42[0-9]{10}$/)],
      state: ['ENABLED'],
      street: ['', Validators.required],
      zip: ['', Validators.required],
    });

    this.store.select('issuers').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<Pagination<IssuerModel>>) => {
        this.loading = loading;
        if (error) {
          console.error('Issuer API call has returned error', error);
          return;
        }
        if (data != null) {
          this.tableData = data;
          this.issuers = this.tableData.content;
          this.rows = this.issuers.map(item => Object.assign({}, item));
        }
      }
    );
    this.store.dispatch({type: issuersActions.ISSUERS_API_GET, payload: this.issuersRequest});
  }

  toggleNewIssuerModal(): void {
    this.newIssuerModalShowing = !this.newIssuerModalShowing;
  }

  addIssuer(): void {
    if (this.newIssuerForm.invalid) {
      // show some error messages maybe ?
      return;
    }


    this.api.post('/issuers', this.newIssuerForm.value).subscribe(
      () => {
        this.newIssuerForm.reset();
        this.store.dispatch({type: issuersActions.ISSUERS_API_GET, payload: this.issuersRequest});
      },
      error => {
        console.error('Create issuer fail', error);
      }
    );
    this.toggleNewIssuerModal();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  isPresent(value: string): boolean {
    const item = this.newIssuerForm.get(value);
    return item.touched && item.errors != null && item.errors.required;
  }

  onSelect({selected}: { selected: IssuerModel[] }): void {
    if (selected && selected.length > 0) {
      this.router.navigateByUrl(`/platform/issuers/${selected[0].code}`);
    }
  }

  setPage(pageInfo: any): void {
    this.issuersRequest.pagination.start = pageInfo.offset * this.issuersRequest.pagination.number;
    this.store.dispatch({type: issuersActions.ISSUERS_API_GET, payload: this.issuersRequest});
  }

  getSortedIssuers(sortInfo: any): void {
    this.issuersRequest.sort = {predicate: sortInfo.sorts[0].prop, reverse: sortInfo.sorts[0].dir === 'asc'};
    this.store.dispatch({type: issuersActions.ISSUERS_API_GET, payload: this.issuersRequest});
  }

  changeLimit(limit: number): void {
    if (this.issuersRequest.pagination.number === limit) {
      return;
    }
    this.issuersRequest.pagination.number = limit;
    this.store.dispatch({type: issuersActions.ISSUERS_API_GET, payload: this.issuersRequest});
  }

}
