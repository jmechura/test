import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mss-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() routes: { link: string, label: string }[];

  constructor(private router: Router) {

  }

  redirect(link: string): void {
    this.router.navigateByUrl(link);
  }
}
