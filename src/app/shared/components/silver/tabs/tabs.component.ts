import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mss-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

  @Input() items: string[] = [];
  @Output() itemChanged: EventEmitter<string> = new EventEmitter<string>();
  selected = 0;
  lineStart = 0;

  move(index: number): void {
    this.itemChanged.emit(this.items[index]);
    this.selected = index;
    this.lineStart = index * 100 / this.items.length;
  }
}
