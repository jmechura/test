import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export type ToolbarPosition = 'side' | 'top';

@Component({
  selector: 'mss-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() routes: { link: string, label: string }[];
  @Input() position: ToolbarPosition = 'top';

  constructor(private router: Router) {

  }

  redirect(link: string): void {
    this.router.navigateByUrl(link);
  }
}
