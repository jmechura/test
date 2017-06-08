import { Component } from '@angular/core';

@Component({
  selector: 'mss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  toolbarData = [
    {label: 'Platform', link: '/platform'},
    {label: 'Showcase', link: '/showcase'},
    {label: 'Login', link: '/login'},
  ];
}
