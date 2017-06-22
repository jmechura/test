import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mss-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  @Input() data: any[] = [];
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  emitClick(item: any): void {
    if (item.clickable) {
      this.clicked.emit(item);
    }
  }
}
