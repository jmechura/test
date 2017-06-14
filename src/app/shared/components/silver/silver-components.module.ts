import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataTableComponent } from './data-table/data-table.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { AutocompleteInputComponent } from './autocomplete-input/autocomplete-input.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BronzeComponentsModule } from '../bronze/bronze-components.module';
import { DatePickerInputComponent } from './date-picker-input/date-picker-input.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DataTableComponent,
    TimePickerComponent,
    AutocompleteInputComponent,
    DatePickerInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgxDatatableModule,
    BronzeComponentsModule,
  ],
  exports: [
    DataTableComponent,
    TimePickerComponent,
    AutocompleteInputComponent,
    NgxDatatableModule,
    DatePickerInputComponent,
  ],
  providers: [],
})
export class SilverComponentsModule {
}
