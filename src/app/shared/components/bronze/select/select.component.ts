import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SelectItem {
  label?: string;
  value: string | number;
}

@Component({
  selector: 'mss-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  /**
   * name of dropdown which is shown before selection
   * @type {string}
   */
  @Input() showName = 'Please select';
  /**
   * selected options
   */
  @Input() selectedOption: number | string;
  @Output() selectedOptionChange = new EventEmitter<number | string>();
  /**
   * options of possible selection
   * @type {Array}
   */
  @Input() options: SelectItem[] = [];

  show = false;

  get option(): string | number {
    if (this.options.length > 0 && this.selectedOption) {
      const option = this.options.find(item => this.selectedOption === item.value);
      return option.label ? option.label : option.value;
    }
  }

  selectOption(selected: number | string): void {
    this.selectedOptionChange.emit(selected);
    this.switchDropdown();
  }

  switchDropdown(): void {
    this.show = !this.show;
  }
}
