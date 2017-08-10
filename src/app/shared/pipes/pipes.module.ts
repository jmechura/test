import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MssDatePipe } from './mss-date.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MssDatePipe],
  exports: [MssDatePipe]
})
export class PipesModule {
}
