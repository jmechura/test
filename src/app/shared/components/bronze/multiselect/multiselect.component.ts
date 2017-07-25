import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { SelectItem } from 'app/shared/components/bronze/select/select.component';
import { LanguageService } from '../../../services/language.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface MultiSelectItem {
  label?: string;
  value: string | number;
  selected: boolean;
}

@Component({
  selector: 'mss-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiselectComponent),
    multi: true,
  }]
})
export class MultiselectComponent implements ControlValueAccessor {

  /**
   * name of dropdown which is shown before selection
   * @type {string}
   */
  @Input() showName: string;
  /**
   * selected options
   */
  @Input()
  set selectedOptions(values: (number | string)[]) {
    this.optionsValues = [
      ...this.optionsValues.filter((item) => (values.some((element) => item.value === element))).map((item) => ({...item, selected: true})),
      ...this.optionsValues.filter((item) => (values.every((element) => item.value !== element)))
    ];
    this.optionsValues.sort((item1, item2) => (this.sortAsc(item1.value, item2.value)));
  }
  get selectedOptions(): (number | string)[] {
    return this.optionsValues.filter(item => item.selected).map(item => item.value);
  }
  @Output() selectedOptionsChange = new EventEmitter<(number | string)[]>();

  /**
   * options of possible selection
   * @type {Array}
   */
  optionsValues: MultiSelectItem[] = [];
  @Input()
  set options(items: SelectItem[]) {
    this.optionsValues = items.map((item) => ({...item, selected: false})).sort((item1, item2) => (this.sortAsc(item1.value, item2.value)));
  }

  /**
   * States whether select should be disabled
   * @type {boolean}
   */
  @Input() disabled = false;

  @Input() clearAble = false;

  @Input() label: string;

  @Input() labelPosition: 'left' | 'top' = 'left';

  @Input() variant: 'default' | 'small' = 'default';

  show = false;

  private changeCallback: any;
  private touchedCallback: any;

  get selectedOptionLabel(): string {
   const selectedOptions = this.optionsValues && this.optionsValues.filter(item => item.selected);
   return selectedOptions.length > 0 ? selectedOptions.map(item => item.label || item.value).join(', ') : this.showName;
   }

  constructor(private language: LanguageService) {
    this.showName = this.language.translate('components.select.placeholder');
  }

  selectOption(selectedItem: number | string): void {
    this.optionsValues = [
      ...this.optionsValues.filter((item) => (item.value !== selectedItem)),
      {
        ...this.optionsValues.filter((item) => (item.value === selectedItem))[0],
        selected: !this.optionsValues.filter((item) => (item.value === selectedItem))[0].selected
      }
    ];
    this.selectedOptionsChange.emit(this.selectedOptions);
    if (this.changeCallback) {
      this.changeCallback(this.selectedOptions);
      this.writeValue(this.selectedOptions);
    }
    this.touched();
  }

  clearInput(event: MouseEvent): void {
    event.stopPropagation();
    this.optionsValues = this.optionsValues.map((item) => ({...item, selected: false}));
    this.selectedOptionsChange.emit(this.selectedOptions);
  }

  switchDropdown(): void {
    this.show = !this.show;
  }

  private sortAsc(item1: number | string, item2: number | string): number {
    if (item1 > item2) {
      return 1;
    }
    return -1;
  }

  touched(): void {
    if (this.touchedCallback) {
      this.touchedCallback();
    }
  }

  writeValue(obj: any): void {
    this.selectedOptions = obj;
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
