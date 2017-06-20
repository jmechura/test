import { Component } from '@angular/core';
import { ToolbarPosition } from '../shared/components/bronze/toolbar/toolbar.component';
import { Router } from '@angular/router';

const ROUTE_PREFIX = '/platform';

@Component({
  selector: 'mss-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent {

  currentBalance = 0;

  toolbarPosition: ToolbarPosition = 'side';

  toolbarData = [
    {label: 'Přehled', link: ROUTE_PREFIX + '/dashboard', icon: 'dashboard'},
    {label: 'Moje Karta', link: ROUTE_PREFIX + '/card', icon: 'credit_card'},
    {label: 'Nastavení', link: ROUTE_PREFIX + '/settings', icon: 'settings'},
    {label: 'Showcase', link: ROUTE_PREFIX + '/showcase', icon: 'view_list'},
  ];

  constructor(private router: Router) {

  }

  logOut(): void {
    this.router.navigateByUrl('/login');
  }
}
