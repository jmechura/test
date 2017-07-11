import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { AutocompleteInputComponent } from './autocomplete-input/autocomplete-input.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BronzeComponentsModule } from '../bronze/bronze-components.module';
import { DatePickerInputComponent } from './date-picker-input/date-picker-input.component';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';
import { TableFooterComponent } from './table-footer/table-footer.component';

@NgModule({
  declarations: [
    TimePickerComponent,
    AutocompleteInputComponent,
    DatePickerInputComponent,
    TabsComponent,
    TableFooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgxDatatableModule,
    BronzeComponentsModule,
  ],
  exports: [
    TimePickerComponent,
    AutocompleteInputComponent,
    NgxDatatableModule,
    DatePickerInputComponent,
    TabsComponent,
    TableFooterComponent,
  ],
  providers: [],
})
export class SilverComponentsModule {
}
