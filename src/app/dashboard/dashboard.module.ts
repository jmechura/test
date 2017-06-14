import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { BronzeComponentsModule } from '../shared/components/bronze/bronze-components.module';
import { SilverComponentsModule } from '../shared/components/silver/silver-components.module';

@NgModule({
  imports: [
    CommonModule,
    BronzeComponentsModule,
    SilverComponentsModule,
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
