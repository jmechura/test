import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleCheckDirective } from './role-check.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RoleCheckDirective
  ],
  exports: [
    RoleCheckDirective
  ]
})
export class DirectivesModule {
}
