import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowcaseComponent } from './showcase/showcase.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from 'app/settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'showcase', component: ShowcaseComponent},
      {path: 'login', component: LoginComponent},
      {path: 'settings', component: SettingsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
