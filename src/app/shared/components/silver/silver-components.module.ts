import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataTableComponent } from './data-table/data-table.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { AutocompleteInputComponent } from './autocomplete-input/autocomplete-input.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BronzeComponentsModule } from '../bronze/bronze-components.module';

@NgModule({
  declarations: [
    DataTableComponent,
    TimePickerComponent,
    AutocompleteInputComponent,
    DatePickerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgxDatatableModule,
    BronzeComponentsModule,
  ],
  exports: [
    DataTableComponent,
    TimePickerComponent,
    AutocompleteInputComponent,
    DatePickerComponent,
    NgxDatatableModule,
  ],
  providers: [],
})
export class SilverComponentsModule {
}
