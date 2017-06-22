import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformComponent } from './platform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { SilverComponentsModule } from '../shared/components/silver/silver-components.module';
import { BronzeComponentsModule } from '../shared/components/bronze/bronze-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PlatformRoutingModule } from './platform-routing.module';
import { ShowcaseComponent } from './showcase/showcase.component';
import { CardViewComponent } from './card-view/card-view.component';
import { EmployeeManagementComponent } from './employee-managment/employee-management.component';
import { EmployerCardComponent } from './employer-card/employer-card.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

@NgModule({
  imports: [
    CommonModule,
    PlatformRoutingModule,
    BronzeComponentsModule,
    SilverComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PlatformComponent,
    DashboardComponent,
    SettingsComponent,
    ShowcaseComponent,
    CardViewComponent,
    EmployeeManagementComponent,
    EmployerCardComponent,
    TransactionDetailComponent,
  ]
})
export class PlatformModule { }
