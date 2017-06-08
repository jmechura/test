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
    {label: 'Platform', link: '/platform'},
    {label: 'Showcase', link: '/showcase'},
    {label: 'Login', link: '/login'},
    {label: 'Settings', link: '/settings'},
  ];
}
