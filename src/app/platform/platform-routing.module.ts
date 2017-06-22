import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { PlatformComponent } from './platform.component';
import { CardViewComponent } from './card-view/card-view.component';
import { EmployeeManagementComponent } from './employee-managment/employee-management.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

export const routes: Routes = [
  {
    path: '', component: PlatformComponent, children: [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'showcase', component: ShowcaseComponent},
    {path: 'settings', component: SettingsComponent},
    {path: 'card', component: CardViewComponent},
    {path: 'employees', component: EmployeeManagementComponent},
    {path: 'transaction/:id', component: TransactionDetailComponent},
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule {
}
