import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BronzeComponentsModule } from '../shared/components/bronze/bronze-components.module';

@NgModule({
  imports: [
    CommonModule,
    BronzeComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }
