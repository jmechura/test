import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformComponent } from './platform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { SilverComponentsModule } from '../shared/components/silver/silver-components.module';
import { BronzeComponentsModule } from '../shared/components/bronze/bronze-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlatformRoutingModule } from './platform-routing.module';
import { ShowcaseComponent } from './showcase/showcase.component';
import { CardViewComponent } from './card-view/card-view.component';
import { EmployeeManagementComponent } from './employee-managment/employee-management.component';
import { CardListComponent } from './employer-card/card-list.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { RoutingTableComponent } from './routing-table/routing-table.component';
import { RoutesComponent } from './routes/routes.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { SequencesComponent } from './sequences/sequences.component';
import { IssuersComponent } from './issuers/issuers.component';
import { IssuerDetailComponent } from './issuer-detail/issuer-detail.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { DataTableComponent } from './showcase/data-table/data-table.component';
import { CardRequestComponent } from './card-request/card-request.component';
import { CardRequestDetailComponent } from './card-request-detail/card-request-detail.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { TerminalComponent } from './terminal/terminal.component';

@NgModule({
  imports: [
    CommonModule,
    PlatformRoutingModule,
    BronzeComponentsModule,
    SilverComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PlatformComponent,
    DashboardComponent,
    SettingsComponent,
    ShowcaseComponent,
    CardViewComponent,
    EmployeeManagementComponent,
    CardListComponent,
    TransactionDetailComponent,
    RoutingTableComponent,
    RoutesComponent,
    MerchantsComponent,
    IssuersComponent,
    IssuerDetailComponent,
    CampaignsComponent,
    DataTableComponent,
    SequencesComponent,
    CardRequestComponent,
    CardRequestDetailComponent,
    CardDetailComponent,
    TerminalComponent,
  ]
})
export class PlatformModule {
}
