import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SelectItem } from '../../bronze/select/select.component';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'mss-table-footer',
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFooterComponent {

  @Input() rowsShown = 0;
  @Input() rowCount = 0;

  @Input() set page(val: number) {
    this.currPage = val;
    this.oldPage = val;
  }

  @Input() rowLimitOptions: SelectItem[] = [{value: 5}, {value: 10}, {value: 15}, {value: 20}];
  @Output() rowsShownChange = new EventEmitter<number>();
  @Output() changePage: EventEmitter<{ page: number }> = new EventEmitter();

  @ViewChild('tablePage') tablePage: ElementRef;

  currPage = 1;
  oldPage = 1;
  limitText: string;

  get totalPages(): number {
    return Math.ceil(this.rowCount / this.rowsShown);
  }

  get canPrevious(): boolean {
    return this.currPage > 1;
  }

  get canNext(): boolean {
    return this.currPage < this.totalPages;
  }

  constructor(private language: LanguageService) {
    this.limitText = this.language.translate('components.pager.limitText');
  }

  prevPage(): void {
    this.selectPage(this.currPage - 1);
  }

  nextPage(): void {
    this.selectPage(this.currPage + 1);
  }

  selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.currPage) {
      this.currPage = page;
      this.changePage.emit({page});
    }
  }

  /**
   * you can use only number in input and special char which are
   * [backspace, delete, left-arrow, right-arrow, tab] in this order
   * @param event
   */
  handleNumbers(event: KeyboardEvent): void {
    if (event.keyCode > 105 || event.keyCode < 96) {
      if (!([8, 9, 37, 39, 46].indexOf(event.keyCode) !== -1)) {
        event.preventDefault();
      }
      return;
    }
  }

  setTablePage(page: number): void {
    const value = page > this.totalPages ? this.totalPages : page;
    this.currPage = value;
    this.tablePage.nativeElement.value = value;
  }

  handleInput(event?: KeyboardEvent): void {
    const page = this.currPage !== null ? (this.currPage === 0 ? 1 : this.currPage) : this.oldPage;
    this.currPage = page;
    this.changePage.emit({page});
    if (event) {
      (<HTMLElement>event.target).blur();
    }
  }

  changeLimit(limit: number): void {
    this.rowsShownChange.emit(limit);
  }
}
