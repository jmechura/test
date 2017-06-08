import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformComponent } from './platform/platform.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'platform', component: PlatformComponent},
      {path: 'showcase', component: ShowcaseComponent},
      {path: 'login', component: LoginComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
