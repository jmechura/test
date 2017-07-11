import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mss-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
  }]
})
export class InputComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() placeholder = 'Zadejte hodnotu';
  @Input() type = 'text';
  @Input() warn = false;

  @Input() value: string | number;
  @Output() valueChange = new EventEmitter<string | number>();

  disabled = false;

  private changeCallback: any;
  private touchedCallback: any;


  get inputValue(): string | number {
    return this.value;
  }

  set inputValue(newValue: string | number) {
    this.valueChange.emit(newValue);
    if (this.changeCallback) {
      this.changeCallback(newValue);
    }
  }

  touched(): void {
    if (this.touchedCallback) {
      this.touchedCallback();
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
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
