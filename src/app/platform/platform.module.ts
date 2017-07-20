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
import { OrgUnitListComponent } from './org-unit-list/org-unit-list.component';
import { IssuersComponent } from './issuers/issuers.component';
import { IssuerDetailComponent } from './issuer-detail/issuer-detail.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { DataTableComponent } from './showcase/data-table/data-table.component';
import { CampaignsDetailComponent } from './campaigns-detail/campaigns-detail.component';
import { CardRequestComponent } from './card-request/card-request.component';
import { CardRequestDetailComponent } from './card-request-detail/card-request-detail.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { TemplatesComponent } from './templates/templates.component';
import { TemplateDetailComponent } from './template-detail/template-detail.component';
import { TerminalComponent } from './terminal/terminal.component';
import { CardGroupsComponent } from './card-groups/card-groups.component';
import { CardGroupDetailComponent } from './card-group-detail/card-group-detail.component';
import { GoldComponentsModule } from '../shared/components/gold/gold-components.module';
import { OrgUnitDetailComponent } from './org-unit-detail/org-unit-detail.component';
import { ImportsComponent } from './imports/imports.component';
import { ImportDetailComponent } from './import-detail/import-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { AcquirersComponent } from './acquirers/acquirers.component';
import { AcquirerDetailComponent } from './acquirer-detail/acquirer-detail.component';
import { DirectivesModule } from '../shared/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    PlatformRoutingModule,
    BronzeComponentsModule,
    SilverComponentsModule,
    GoldComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DirectivesModule
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
    OrgUnitListComponent,
    IssuersComponent,
    IssuerDetailComponent,
    CampaignsComponent,
    DataTableComponent,
    CampaignsDetailComponent,
    SequencesComponent,
    CardRequestComponent,
    CardRequestDetailComponent,
    CardDetailComponent,
    TemplatesComponent,
    TemplateDetailComponent,
    CardDetailComponent,
    TerminalComponent,
    CardGroupsComponent,
    CardGroupDetailComponent,
    CardDetailComponent,
    OrgUnitDetailComponent,
    ImportsComponent,
    ImportDetailComponent,
    ReportsComponent,
    ReportDetailComponent,
    AcquirersComponent,
    AcquirerDetailComponent,
    EmployeeDetailComponent,
  ]
})
export class PlatformModule {}
