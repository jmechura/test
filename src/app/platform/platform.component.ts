import { Component } from '@angular/core';
import { ToolbarPosition } from '../shared/components/bronze/toolbar/toolbar.component';

const ROUTE_PREFIX = '/platform';

@Component({
  selector: 'mss-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent {

  toolbarPosition: ToolbarPosition = 'side';

  toolbarData = [
    {label: 'Showcase', link: ROUTE_PREFIX + '/showcase'},
    {label: 'Dashboard', link: ROUTE_PREFIX + '/dashboard'},
    {label: 'Settings', link: ROUTE_PREFIX + '/settings'},
  ];
}
