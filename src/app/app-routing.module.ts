import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformComponent } from './platform/platform.component';
import { ShowcaseComponent } from './showcase/showcase.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'platform', component: PlatformComponent},
      {path: 'showcase', component: ShowcaseComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
