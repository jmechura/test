import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CanActivateLanguageGuard } from './shared/guards/language.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateLanguageGuard],
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'platform', loadChildren: 'app/platform/platform.module#PlatformModule'},
      {path: '**', redirectTo: 'login'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
