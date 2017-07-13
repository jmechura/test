import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'mss-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true,
  }]
})
export class ToggleComponent implements ControlValueAccessor {

  @Input() label: string;

  @Input() toggled = false;
  @Output() toggledChange = new EventEmitter<boolean>();

  private changeCallback: any;
  private touchedCallback: any;

  toggleClick(): void {
    this.toggledChange.emit(!this.toggled);
    if (this.changeCallback) {
      this.changeCallback(!this.toggled);
    }
    this.writeValue(!this.toggled);
    this.touched();
  }

  touched(): void {
    if (this.touchedCallback) {
      this.touchedCallback();
    }
  }

  writeValue(value: boolean | string): void {
    this.toggled = value && value !== 'false';
  }

  registerOnChange(fn: any): void {
    this.changeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedCallback = fn;
  }
}
