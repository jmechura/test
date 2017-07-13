import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mss-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string;

  @Input() checked: boolean;
  @Output() checkedChange = new EventEmitter<boolean>();

  private changeCallback: (checked: boolean) => void;
  private touchedCallback: () => void;

  checkboxClicked(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
    if (this.changeCallback && this.touchedCallback) {
      this.changeCallback(this.checked);
      this.touchedCallback();
    }
  }

  writeValue(checked: boolean): void {
    this.checked = checked;
  }

  registerOnChange(fn: (checked: boolean) => void): void {
    this.changeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touchedCallback = fn;
  }
}
