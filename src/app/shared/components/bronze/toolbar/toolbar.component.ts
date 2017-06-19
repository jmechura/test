import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

export type ToolbarPosition = 'side' | 'top';

@Component({
  selector: 'mss-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnDestroy {

  @Input() routes: { link: string, label: string, icon: string }[];
  @Input() position: ToolbarPosition = 'top';

  private unsubscribe$ = new Subject<void>();
  activeRoute = '';

  constructor(private router: Router) {
    this.router.events.takeUntil(this.unsubscribe$).subscribe((() => {
      this.activeRoute = this.router.url;
    }));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  redirect(link: string): void {
    this.router.navigateByUrl(link);
  }
}
