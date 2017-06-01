import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mss-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {

  @Input() label: string;

  @Input() checked: boolean;
  @Output() checkedChange = new EventEmitter<boolean>();

  checkboxClicked(): void {
    this.checkedChange.emit(!this.checked);
  }
}
