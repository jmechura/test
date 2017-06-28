import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { PlatformComponent } from './platform.component';
import { CardViewComponent } from './card-view/card-view.component';
import { EmployeeManagementComponent } from './employee-managment/employee-management.component';
import { EmployerCardComponent } from './employer-card/employer-card.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { RoutingTableComponent } from './routing-table/routing-table.component';
import { RoutesComponent } from './routes/routes.component';
import { MerchantsComponent } from './merchants/merchants.component';
import { CampaignsComponent } from './campaigns/campaigns.component';

export const routes: Routes = [
  {
    path: '', component: PlatformComponent, children: [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'showcase', component: ShowcaseComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'card', component: CardViewComponent},
    {path: 'employees', component: EmployeeManagementComponent},
    {path: 'employer-card', component: EmployerCardComponent},
    {path: 'routing-table', component: RoutingTableComponent},
    {path: 'routing-table/:id', component: RoutesComponent},
    {path: 'merchants', component: MerchantsComponent},
    {path: 'campaigns', component: CampaignsComponent},
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
