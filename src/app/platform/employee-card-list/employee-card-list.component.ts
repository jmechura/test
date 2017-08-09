import { Component, OnDestroy } from '@angular/core';
import { UnsubscribeSubject } from '../../shared/utils';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { employeeCardsActions, EmployeeCardState } from '../../shared/reducers/employee-cards.reducer';
import { Card } from '../../shared/models/card.model';
import { Router } from '@angular/router';

const ITEM_LIMIT_OPTIONS = [5, 10, 15, 20];

@Component({
  selector: 'mss-employee-card-list',
  templateUrl: './employee-card-list.component.html',
  styleUrls: ['./employee-card-list.component.scss']
})
export class EmployeeCardListComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();
  rows: Card[];
  loading = false;
  rowLimit = ITEM_LIMIT_OPTIONS[0];

  constructor(private store: Store<AppStateModel>,
              private router: Router) {
    this.store.dispatch({type: employeeCardsActions.EMPLOYEE_CARDS_GET_REQUEST});
    this.store.select('employeeCards').takeUntil(this.unsubscribe$).subscribe(
      (data: EmployeeCardState) => {
        this.loading = data.loading;
        if (data.error) {
          console.error('Error occurred while retrieving employee cards', data.error);
          return;
        }

        if (data.data != undefined && !data.loading) {
          this.rows = data.data.map(item => item);
        }
      }
    );
  }

  getFormatedExpiration(date: string): string {
    return (date != null && date.length > 0) ? `${date.slice(0, 2)}/${date.slice(2, 4)}` : '';
  }

  changeLimit(itemLimit: number): void {
    this.rowLimit = itemLimit;
  }

  goToDetail(card: Card): void {
    this.router.navigateByUrl(`platform/card/${card.cardUuid}`);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
