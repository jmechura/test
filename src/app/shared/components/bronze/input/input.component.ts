import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mss-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  @Input() label: string;
  @Input() placeholder = 'Please insert value';
  @Input() type = 'text';

  @Input() value: string | number;
  @Output() valueChange = new EventEmitter<string | number>();

  get inputValue(): string | number {
    return this.value;
  }

  set inputValue(newValue: string | number) {
    this.valueChange.emit(newValue);
  }
}
