import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mss-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent {

  @Input() overlay = true;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeModal(): void {
    this.visibleChange.emit(false);
  }
}
