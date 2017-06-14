import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FormComponent } from './form/form.component';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    FormComponent,
    AuthFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
  ],
  exports: [
    FormComponent,
    AuthFormComponent,
  ],
  providers: [],
})
export class GoldComponentsModule {
}
