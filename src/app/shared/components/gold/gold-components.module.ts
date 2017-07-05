import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FormComponent } from './form/form.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { CommonModule } from '@angular/common';
import { OrgUnitFormComponent } from './org-unit-form/org-unit-form.component';
import { BronzeComponentsModule } from '../bronze/bronze-components.module';


@NgModule({
  declarations: [
    FormComponent,
    AuthFormComponent,
    OrgUnitFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BronzeComponentsModule,
  ],
  exports: [
    FormComponent,
    AuthFormComponent,
    OrgUnitFormComponent,
  ],
  providers: [],
})
export class GoldComponentsModule {
}
