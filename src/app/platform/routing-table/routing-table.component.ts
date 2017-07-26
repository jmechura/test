import { Component, OnDestroy, ViewChild } from '@angular/core';
import { RoutingTable } from '../../shared/models/routin.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { routingTableActions } from '../../shared/reducers/routing-table.reducer';
import { StateModel } from '../../shared/models/state.model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnsubscribeSubject } from '../../shared/utils';

const ROUTING_TABLE_ROUTE = 'platform/routing-table';

@Component({
  selector: 'mss-routing-table',
  templateUrl: './routing-table.component.html',
  styleUrls: ['./routing-table.component.scss'],
})

export class RoutingTableComponent implements OnDestroy {
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
  private unsubscribe$ = new UnsubscribeSubject();
  edit = null;
  editModel: string;
  formerData: RoutingTable[] = [];
  warnModalVisible = false;
  deleteRowName;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
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

  changeLimit(limit: number): void {
    this.rowLimit = limit;
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

  switchWarnModal(): void {
    this.warnModalVisible = !this.warnModalVisible;
  }

  addRoutingTable(): void {
    if (this.newTableForm.invalid) {
      return;
    }
    this.store.dispatch({type: routingTableActions.ROUTING_TABLE_API_POST, payload: this.newTable});
    this.switchModal();
  }

  showDeleteModal(event: MouseEvent, row: RoutingTable): void {
    event.stopPropagation();
    this.deleteRowName = row.name;
    this.switchWarnModal();
  }

  deleteRow(): void {
    this.store.dispatch({type: routingTableActions.ROUTING_TABLE_API_DELETE, payload: this.deleteRowName});
    this.switchWarnModal();
  }

  onSelect(select: { selected: RoutingTable[] }): void {
    this.router.navigate([`${ROUTING_TABLE_ROUTE}/${select.selected[0].name}`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
