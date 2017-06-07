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

  @Input() filterPlaceholder = 'Search';
  @Input() completeArray = [];
  @Input() columns = [
    {prop: 'name'},
    {name: 'Company'},
    {name: 'Gender'}
  ];

  rows = [];
  rowLimit = 10;
  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];

  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor() {
    this.fetch((data) => {
      // cache our list
      this.completeArray = [...data];

      // push our inital complete list
      this.rows = data;
    });
  }

  fetch(cb: any): void {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/mock/company.json`);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  updateFilter(event: KeyboardEvent): void {
    const pattern = (<HTMLInputElement>event.target).value.toLowerCase();

    // update the rows
    this.rows = this.completeArray.filter((item: any) => item.name.toLowerCase().indexOf(pattern) !== -1 || !pattern);
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

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
