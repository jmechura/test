import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { PlatformComponent } from './platform.component';
import { CardViewComponent } from './card-view/card-view.component';
import { EmployeeManagementComponent } from './employee-managment/employee-management.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { RoutingTableComponent } from './routing-table/routing-table.component';
import { RoutesComponent } from './routes/routes.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { OrgUnitListComponent } from './org-unit-list/org-unit-list.component';
import { IssuersComponent } from './issuers/issuers.component';
import { IssuerDetailComponent } from './issuer-detail/issuer-detail.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { CampaignsDetailComponent } from './campaigns-detail/campaigns-detail.component';
import { SequencesComponent } from './sequences/sequences.component';
import { CardRequestComponent } from './card-request/card-request.component';
import { CardRequestDetailComponent } from './card-request-detail/card-request-detail.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { TerminalComponent } from './terminal/terminal.component';
import { CardGroupsComponent } from './card-groups/card-groups.component';
import { CardGroupDetailComponent } from './card-group-detail/card-group-detail.component';
import { CardListComponent } from './employer-card/card-list.component';
import { OrgUnitDetailComponent } from './org-unit-detail/org-unit-detail.component';

export const routes: Routes = [
  {
    path: '', component: PlatformComponent, children: [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'showcase', component: ShowcaseComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'card', component: CardViewComponent},
    {path: 'employees', component: EmployeeManagementComponent},
    {path: 'employer-card', component: CardListComponent},
    {path: 'employer-card/:uuid', component: CardDetailComponent},
    {path: 'routing-table', component: RoutingTableComponent},
    {path: 'routing-table/:id', component: RoutesComponent},
    {path: 'merchants', component: MerchantsComponent},
    {path: 'sequences', component: SequencesComponent},
    {path: 'org-units', component: OrgUnitListComponent},
    {path: 'org-units/:id', component: OrgUnitDetailComponent},
    {path: 'issuers', component: IssuersComponent},
    {path: 'issuers/:id', component: IssuerDetailComponent},
    {path: 'campaigns', component: CampaignsComponent},
    {path: 'campaigns/:name', component: CampaignsDetailComponent},
    {path: 'card-request', component: CardRequestComponent},
    {path: 'card-request/:uuid', component: CardRequestDetailComponent},
    {path: 'terminal', component: TerminalComponent},
    {path: 'card-groups', component: CardGroupsComponent},
    {path: 'card-groups/:id', component: CardGroupDetailComponent},
    {path: 'transaction/:uuid/:termDttm', component: TransactionDetailComponent},
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule {
}
