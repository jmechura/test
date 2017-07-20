import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FormComponent } from './form/form.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { CommonModule } from '@angular/common';
import { OrgUnitFormComponent } from './org-unit-form/org-unit-form.component';
import { BronzeComponentsModule } from '../bronze/bronze-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  declarations: [
    FormComponent,
    AuthFormComponent,
    OrgUnitFormComponent,
    EmployeeFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BronzeComponentsModule,
    TranslateModule,
    DirectivesModule,
  ],
  exports: [
    FormComponent,
    AuthFormComponent,
    OrgUnitFormComponent,
    EmployeeFormComponent,
  ],
  providers: [],
})
export class GoldComponentsModule {
}
