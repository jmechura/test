import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { BronzeComponentsModule } from '../shared/components/bronze/bronze-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BronzeComponentsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
  ],
  declarations: [
    LoginComponent,
  ]
})
export class LoginModule {
}
