import { Component } from '@angular/core';
import { ToolbarPosition } from './shared/components/bronze/toolbar/toolbar.component';

@Component({
  selector: 'mss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  toolbarPosition: ToolbarPosition = 'side';

  toolbarData = [
    {label: 'Showcase', link: '/showcase'},
    {label: 'Login', link: '/login'},
    {label: 'Dashboard', link: '/dashboard'},
    {label: 'Settings', link: '/settings'},
  ];
}
