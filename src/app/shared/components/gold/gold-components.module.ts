import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FormComponent } from './form/form.component';
import { AuthFormComponent } from './auth-form/auth-form.component';


@NgModule({
  declarations: [
    FormComponent,
    AuthFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [],
})
export class GoldComponentsModule {
}
