import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { ActivatedRoute } from '@angular/router';
import { StateModel } from '../../shared/models/state.model';
import { fillRoute, TableRoutes } from '../../shared/models/routin.model';
import { routesActions } from '../../shared/reducers/routes.reducer';
import { ruleActions } from '../../shared/reducers/rule.reducer';
import { targetActions } from '../../shared/reducers/targer.reducer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'mss-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnDestroy {
  private unsubscribe$ = new UnsubscribeSubject();
  loading = false;
  rows: any[] = [];
  tableName: string;

  targets: SelectItem[];
  rules: SelectItem[];

  modalShowing = false;

  newRouteForm: FormGroup;
  newRoute: TableRoutes = fillRoute();

  editRoute: TableRoutes = fillRoute();
  editedRow: any;

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private fb: FormBuilder,
              private language: LanguageService,
              private route: ActivatedRoute) {
    this.store.dispatch({type: ruleActions.RULE_API_GET});
    this.store.dispatch({type: targetActions.TARGET_API_GET});

    this.newRouteForm = fb.group({
      rule: ['', Validators.required],
      ruleParam: '',
      target: ['', Validators.required],
      targetParam: '',
      description: ''
    });

    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      params => {
        this.tableName = params['id'];
        this.store.dispatch({type: routesActions.ROUTES_API_GET, payload: params['id']});
      }
    );

    this.store.select('routes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<TableRoutes[]>) => {
        this.loading = loading;
        if (error) {
          console.error('Routes API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.rows = data;
        }
      }
    );

    this.store.select('rules').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('Rules API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.rules = data.map(item => ({
              value: item,
              label: this.language.translate(`enums.ruleNames.${item}`)
            }
          ));
        }
      }
    );

    this.store.select('targets').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<string[]>) => {
        if (error) {
          console.error('Targets API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.targets = data.map(item => ({
            value: item,
            label: this.language.translate(`enums.targetNames.${item}`)
          }));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  switchModal(): void {
    this.modalShowing = !this.modalShowing;
  }

  addRoute(): void {
    if (this.newRouteForm.invalid) {
      return;
    }
    this.newRoute.orderInTable = this.rows.length > 0 ? this.rows.length : 0;
    this.newRoute.routingTableName = this.tableName;
    this.rows.push(this.newRoute);
    this.switchModal();
    this.newRoute = fillRoute();
  }

  saveRoutes(): void {
    if (!(this.rows.length > 0)) {
      return;
    }
    this.store.dispatch({type: routesActions.ROUTES_API_POST, payload: this.rows});
  }

  get maxOrder(): number {
    return Math.max(...this.rows.map(item => item.orderInTable));
  }

  changeOrder(direction: 1 | -1, index: number): void {
    const orderInTable = this.rows[index].orderInTable;
    if ((orderInTable === this.maxOrder && direction === 1) || (orderInTable === 0 && direction === -1)) {
      return;
    }

    if (direction === 1) {
      this.rows[index].orderInTable++;
      this.rows[index + direction].orderInTable--;
    } else {
      this.rows[index].orderInTable--;
      this.rows[index + direction].orderInTable++;
    }
    this.rows = JSON.parse(JSON.stringify(this.rows.sort((a, b) => a.orderInTable - b.orderInTable)));
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);

    if (index > this.rows.length) {
      return;
    }

    let startIndex = index;
    while (startIndex < this.rows.length) {
      this.rows[startIndex].orderInTable--;
      startIndex++;
    }
  }

  editing(row: any): void {
    if (this.editedRow === row) {
      this.saveEditing();
      return;
    }
    if (this.editedRow) {
      this.table.rowDetail.toggleExpandRow(this.editedRow);
    }
    this.editedRow = row;
    this.editRoute = Object.assign({}, this.rows.find(item => item.orderInTable === row.orderInTable));
    this.table.rowDetail.toggleExpandRow(row);
  }

  saveEditing(): void {
    this.table.rowDetail.toggleExpandRow(this.editedRow);
    this.rows[this.rows.findIndex(item => item.orderInTable === this.editedRow.orderInTable)] = Object.assign({}, this.editRoute);
    this.editedRow = null;
    this.rows = [...this.rows];
  }
}
