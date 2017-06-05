import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface RadioItem {
  id: number | string;
  label?: string;
}

@Component({
  selector: 'mss-radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss']
})
export class RadioButtonGroupComponent {

  /**
   * options which are shown as radio
   */
  @Input() options: RadioItem[];
  /**
   * selected option
   */
  @Input() selected: number | string;
  @Output() selectedChange = new EventEmitter<number | string>();

  changeSelected(event: Event, id: number | string): void {
    event.preventDefault();
    this.selectedChange.emit(id);
  }
}
