import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LanguageService } from '../../../services/language.service';

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
  @Input() showName: string;
  /**
   * selected options
   */
  @Input() selectedOption: number | string;
  @Output() selectedOptionChange = new EventEmitter<number | string>();
  /**
   * options of possible selection
   * @type {Array}
   */
  @Input() options: SelectItem[] = null;

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

  get selectedOptionLabel(): string {
    const selectedOption = this.options && this.options.find(item => this.selectedOption === item.value);
    return selectedOption ? selectedOption.label || String(selectedOption.value) : this.showName;
  }

  constructor(private language: LanguageService) {
    this.showName = this.language.translate('components.select.placeholder');
  }

  selectOption(selected: number | string): void {
    this.selectedOption = selected;
    this.selectedOptionChange.emit(selected);
    if (this.changeCallback) {
      this.changeCallback(selected);
      this.writeValue(selected);
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
    this.selectedOption = obj;
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
