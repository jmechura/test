import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectItem {
  label?: string;
  value: string | number;
}

@Component({
  selector: 'mss-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }]
})
export class SelectComponent implements ControlValueAccessor {
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

  /**
   * States whether select should be disabled
   * @type {boolean}
   */
  @Input() disabled = false;


  @Input() label: string;

  @Input() labelPosition: 'left' | 'top' = 'left';

  @Input() variant: 'default' | 'small' = 'default';

  show = false;

  private changeCallback: any;
  private touchedCallback: any;

  get option(): string | number {
    if (this.options.length > 0 && this.selectedOption) {
      const option = this.options.find(item => this.selectedOption === item.value);
      return option.label ? option.label : option.value;
    }
  }

  selectOption(selected: number | string): void {
    this.selectedOptionChange.emit(selected);
    if (this.changeCallback) {
      this.changeCallback(selected);
    }
    this.touched();
    this.switchDropdown();
  }

  switchDropdown(): void {
    this.show = !this.show;
  }

  touched(): void {
    if (this.touchedCallback) {
      this.touchedCallback();
    }
  }

  writeValue(obj: any): void {
    // This function has to be here, but we don't want it to do anything...
  }

  registerOnChange(fn: any): void {
    this.changeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedCallback = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
