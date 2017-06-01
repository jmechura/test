import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mss-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {

  @Input() label: string;

  @Input() toggled = false;
  @Output() toggledChange = new EventEmitter<boolean>();

  toggleClick(): void {
    this.toggledChange.emit(!this.toggled);
  }
}
