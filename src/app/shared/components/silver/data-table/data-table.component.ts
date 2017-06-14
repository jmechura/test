import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectItem } from '../../bronze/select/select.component';

@Component({
  selector: 'mss-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent {

  @Input() set tableItems(items: any[]) {
    this.rows = items;
    this.table.offset = 0;
  };
  @Input() rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
  @Input() columns = [
    {prop: 'name'},
    {name: 'Company'},
    {name: 'Gender'}
  ];
  rows = [];
  rowLimit = 10;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  getCellClass({value}: any): any {
    return {
      'is-female': value === 'female'
    };
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
}
