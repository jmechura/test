import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { CanActivateLanguageGuard } from './shared/guards/language.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateLanguageGuard],
    canActivateChild: [AuthGuard],
    children: [
      {path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
      {path: 'platform', loadChildren: 'app/platform/platform.module#PlatformModule'},
      {path: '**', redirectTo: 'login'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [AuthGuard, CanActivateLanguageGuard]
})
export class AppRoutingModule {}
