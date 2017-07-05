import { Component, OnDestroy } from '@angular/core';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { ApiService } from '../../shared/services/api.service';
import { OrgUnitModel } from '../../shared/models/org-unit.model';
import { Subject } from 'rxjs';
import { OrgUnitState, orgUnitActions } from '../../shared/reducers/org-unit.reducer';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

const ORG_UNIT_ENDPOINT = '/orgUnits';

@Component({
  selector: 'mss-org-unit-detail',
  templateUrl: './org-unit-detail.component.html',
  styleUrls: ['./org-unit-detail.component.scss']
})
export class OrgUnitDetailComponent implements OnDestroy {
  orgUnit: OrgUnitModel;
  private unsubscribe$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store<AppState>, private api: ApiService, private location: Location) {
    this.route.params.subscribe(
      (params: {id: string}) => {
        this.store.dispatch({type: orgUnitActions.ORG_UNIT_GET_REQUEST, payload: params.id});
      }
    );

    this.store.select('orgUnit').takeUntil(this.unsubscribe$).subscribe(
      (state: OrgUnitState) => {
        if (state.error !== null) {
          console.error('Error getting org unit', state.error);
          return;
        }

        if (state.data) {
          this.orgUnit = state.data;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateOrgUnit(model: OrgUnitModel): void {
    this.api.put(ORG_UNIT_ENDPOINT, model).subscribe(
      () => {
        alert('Obchodní místo aktualizováno!');
      },
      error => {
        console.error('Error updating org unit', error);
      }
    );
  }

  navigateBack(): void {
    this.location.back();
  }
}
