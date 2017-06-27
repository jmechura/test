import { Component, OnDestroy, ViewChild } from '@angular/core';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { RoutingTable } from '../../shared/models/routin.model';
import { Subject } from 'rxjs/Subject';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Store } from '@ngrx/store';
import { AppState } from '../../shared/models/app-state.model';
import { routingTableActions } from '../../shared/reducers/routing-table.reducer';
import { StateModel } from '../../shared/models/state.model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'mss-routing-table',
  templateUrl: './routing-table.component.html',
  styleUrls: ['./routing-table.component.scss'],
})

export class RoutingTableComponent implements OnDestroy {

  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
  columns = [
    {name: 'Name'},
    {name: 'Description'}
  ];
  rows: RoutingTable[] = [];
  rowLimit = 10;
  loading = false;
  modalShowing = false;
  newTable: RoutingTable = {name: '', description: ''};
  newTableForm: FormGroup;
  private unsubscribe$ = new Subject<void>();
  edit = '';
  formerData: RoutingTable[] = [];

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private store: Store<AppState>,
              private fb: FormBuilder,
              private router: Router) {
    this.store.dispatch({type: routingTableActions.ROUTING_TABLE_API_GET});
    this.newTableForm = fb.group({
      name: ['', [Validators.required, this.validateUnique.bind(this)]],
      description: '',
    });

    this.store.select('routingTable').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<RoutingTable[]>) => {
        this.loading = loading;
        if (error) {
          console.error('Routing table API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.rows = data;
          this.formerData = JSON.parse(JSON.stringify(data));
          this.recalculateTable();
        }
      }
    );
  }

  showMessage(): boolean {
    const uniqueControl = this.newTableForm.get('name');
    return uniqueControl.value !== '' && uniqueControl.errors !== null && uniqueControl.errors.uniqueName;
  }

  validateUnique(control: AbstractControl): { [key: string]: boolean } {
    return this.rows.some(item => item.name === control.value) ? {uniqueName: true} : null;
  }

  descriptionChanged(row: any): boolean {
    return this.formerData[row.$$index].description !== this.rows[row.$$index].description;
  }

  editing(edit: string): void {
    this.edit = edit;
  }

  updateValue(event: any, row: any): void {
    this.edit = '';
    this.rows[row.$$index].description = event.target.value;
  }

  saveTable(row: any): void {
    this.store.dispatch({type: routingTableActions.ROUTING_TABLE_API_PUT, payload: this.rows[row.$$index]});
  }

  changeLimit(limit: number): void {
    this.rowLimit = limit;
    this.recalculateTable();
  }

  recalculateTable(): void {
    setTimeout(
      () => {
        this.table.recalculate();
      },
      0
    );
  }

  switchModal(): void {
    this.modalShowing = !this.modalShowing;
  }

  addRoutingTable(): void {
    if (this.newTableForm.invalid) {
      return;
    }
    this.store.dispatch({type: routingTableActions.ROUTING_TABLE_API_POST, payload: this.newTable});
    this.switchModal();
  }

  deleteRow(row: RoutingTable): void {
    this.store.dispatch({type: routingTableActions.ROUTING_TABLE_API_DELETE, payload: row.name});
  }

  selectRow(row: RoutingTable): void {
    this.router.navigate([`platform/routing-table/${row.name}`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
