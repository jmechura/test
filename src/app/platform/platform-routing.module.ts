import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { PlatformComponent } from './platform.component';

export const routes: Routes = [
  {
    path: '', component: PlatformComponent, children: [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'showcase', component: ShowcaseComponent},
    {path: 'settings', component: SettingsComponent},
    {path: '', redirectTo: 'showcase', pathMatch: 'full'}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule {
}
