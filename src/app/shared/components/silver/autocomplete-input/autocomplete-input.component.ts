import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

const MAX_COUNT = 20;
const ARROW_DOWN = 40;
const ARROW_UP = 38;
const ENTER = 13;
const ROW_HEIGHT = 42;

@Component({
  selector: 'mss-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss']
})
export class AutocompleteInputComponent {

  /**
   * label which is shown before input
   */
  @Input() label: string;
  /**
   * placeholder in input
   * @type {string}
   */
  @Input() placeholder = 'Please insert value';

  /**
   * array of item where you can search
   * @param items
   */
  @Input() set searchedItems(items: string[]) {
    this.oldItems = items;
    this.filteredSearchedItems = items;
  }

  /**
   * selected item
   */
  @Input() selected: string;
  @Output() selectedChange = new EventEmitter<string>();

  @ViewChild('autocompleteDropdown') dropdownElementContent: ElementRef;

  pattern = '';
  oldItems: string[];
  filteredSearchedItems: string[];
  rowIndex = 0;
  show = false;

  changeInput(input: string): void {
    this.pattern = input;
    this.filterArray();
  }

  selectOption(item: string): void {
    this.pattern = item;
    this.selectedChange.emit(item);
    this.switchSelect();
  }

  switchSelect(): void {
    this.show = !this.show;
    if (this.pattern) {
      this.filterArray();
    }
  }

  setRow(index: number): void {
    this.rowIndex = index;
  }

  /**
   * handles key event and moves with focus
   * @param event
   */
  key(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case ARROW_DOWN:
        if (this.rowIndex < this.filteredSearchedItems.length - 1) {
          this.rowIndex++;
        } else {
          this.rowIndex = 0;
        }
        break;
      case ARROW_UP:
        if (this.rowIndex > 0) {
          this.rowIndex--;
        } else {
          this.rowIndex = this.filteredSearchedItems.length - 1;
        }
        break;
      case ENTER:
        if (this.filteredSearchedItems[this.rowIndex]) {
          this.selectOption(this.filteredSearchedItems[this.rowIndex]);
          (<HTMLElement>event.target).blur();
        }
        return;
      default :
        break;
    }
    this.scrollRows(event.keyCode);
  }

  /**
   * scroll if needed in dropdown
   * @param key
   */
  scrollRows(key: number): void {
    switch (this.rowIndex) {
      case 0:
        this.dropdownElementContent.nativeElement.scrollTop = 0;
        break;
      case this.filteredSearchedItems.length - 1:
        this.dropdownElementContent.nativeElement.scrollTop = this.filteredSearchedItems.length * ROW_HEIGHT;
        break;
      default:
        if (key === ARROW_DOWN) {
          this.dropdownElementContent.nativeElement.scrollTop += ROW_HEIGHT;
        } else {
          this.dropdownElementContent.nativeElement.scrollTop -= ROW_HEIGHT;
        }
    }
  }

  /**
   * filter dropdown according to pattern
   */
  filterArray(): void {
    this.rowIndex = 0;
    let count = MAX_COUNT;
    this.filteredSearchedItems = [];
    for (const item of this.oldItems) {
      if (item.toLocaleLowerCase().startsWith(this.pattern.toLocaleLowerCase())) {
        if (count > 0) {
          this.filteredSearchedItems.push(item);
          count--;
        } else {
          break;
        }
      }
    }
  }
}
