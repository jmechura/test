import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { fillEmployee, User } from '../../shared/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mss-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: [
    './employee-management.component.scss',
    '../../shared/components/silver/data-table/data-table.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeManagementComponent {

  rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
  columns = [
    {name: 'Id'},
    {name: 'Name'},
    {name: 'Address'},
    {name: 'City'},
    {name: 'Country'},
    {name: 'Postal'},
    {name: 'Phone'},
    {name: 'Email'},
    {name: 'Delete'}
  ];

  newEmployeeForm: FormGroup;
  rows = [];
  rowLimit = 10;
  loading = false;
  modalShowing = false;
  edit = '';
  newEmployee: User = fillEmployee();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(fb: FormBuilder) {
    this.fetch((data: User[]) => {
      this.rows = data.map(item => ({
        id: item.id,
        name: `${item.name} ${item.surname}`,
        address: item.address,
        city: item.city,
        country: item.country,
        postal: item.postal,
        phone: item.phone,
        email: item.email
      }));
      this.loading = false;
    });

    this.newEmployeeForm = fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postal: ['', Validators.required],
      email: ['', control => control.value === '' ? null : Validators.email(control)],
      phone: null
    });
  }

  fetch(cb: any): void {
    this.loading = true;
    const req = new XMLHttpRequest();
    req.open('GET', `assets/mock/employees.json`);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  editing(edit: string): void {
    this.edit = edit;
  }

  updateValue(event: any, cell: any, cellValue: any, row: any): void {
    this.edit = '';
    this.rows[row.$$index][cell] = event.target.value;
  }

  deleteRow(row: any): void {
    this.rows.splice(row.$$index, 1);
  }

  toggleModalShowing(): void {
    this.modalShowing = !this.modalShowing;
  }

  add(): void {
    if (!this.newEmployeeForm.valid) {
      return;
    }
    this.rows.push(this.newEmployee);
    this.toggleModalShowing();
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
